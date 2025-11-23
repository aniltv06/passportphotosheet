#!/usr/bin/env python3
import os
import signal
import subprocess
import time
import socket
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 8888
BROWSER = 'safari'  # or 'chrome' or 'default'
PRIVATE_MODE = False  # Set to True for private browsing (Safari only)
HOST = '0.0.0.0'
CUSTOM_DOMAIN = 'dev.local'  # Change to your preferred domain

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def get_local_ip():
    """Get the machine's local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def kill_port(port):
    """Kill any process using the specified port"""
    try:
        result = subprocess.run(
            ['lsof', '-ti', f':{port}'],
            capture_output=True,
            text=True
        )
        
        if result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                try:
                    os.kill(int(pid), signal.SIGKILL)
                    print(f"Killed process {pid} on port {port}")
                except (ProcessLookupError, ValueError):
                    pass
            
            print(f"Waiting for port {port} to be released...")
            time.sleep(1)
            
            for i in range(5):
                result = subprocess.run(
                    ['lsof', '-ti', f':{port}'],
                    capture_output=True,
                    text=True
                )
                if not result.stdout.strip():
                    print(f"Port {port} is now free")
                    break
                time.sleep(0.5)
        else:
            print(f"Port {port} is already free")
            
    except Exception as e:
        print(f"Error killing port {port}: {e}")

def check_hosts_entry(domain):
    """Check if domain is configured in /etc/hosts for both IPv4 and IPv6"""
    try:
        with open('/etc/hosts', 'r') as f:
            content = f.read()
            has_ipv4 = f'127.0.0.1' in content and domain in content
            has_ipv6 = f'::1' in content and domain in content
            return has_ipv4, has_ipv6
    except:
        return False, False

def add_hosts_entry(domain):
    """Add domain to /etc/hosts if not present (both IPv4 and IPv6)"""
    has_ipv4, has_ipv6 = check_hosts_entry(domain)
    
    if has_ipv4 and has_ipv6:
        print(f"✓ Domain '{domain}' already configured in /etc/hosts (IPv4 & IPv6)")
        return True
    
    entries_to_add = []
    
    if not has_ipv4:
        entries_to_add.append(f"127.0.0.1       {domain}")
        print(f"⚠️  IPv4 entry for '{domain}' missing")
    
    if not has_ipv6:
        entries_to_add.append(f"::1             {domain}")
        print(f"⚠️  IPv6 entry for '{domain}' missing")
    
    if entries_to_add:
        print(f"Adding entries to /etc/hosts (requires sudo)...")
        
        try:
            # Create a temporary file with entries
            entries_text = '\n'.join(entries_to_add)
            cmd = f"echo '{entries_text}' | sudo tee -a /etc/hosts"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✓ Successfully added '{domain}' to /etc/hosts")
                print(f"  Added: {', '.join(['IPv4' if not has_ipv4 else '', 'IPv6' if not has_ipv6 else ''])}")
                return True
            else:
                print(f"✗ Failed to add domain to /etc/hosts")
                return False
        except Exception as e:
            print(f"✗ Error adding domain: {e}")
            return False
    
    return True

def flush_dns_cache():
    """Flush DNS cache to ensure changes take effect"""
    try:
        print("Flushing DNS cache...")
        subprocess.run(['sudo', 'dscacheutil', '-flushcache'], capture_output=True)
        subprocess.run(['sudo', 'killall', '-HUP', 'mDNSResponder'], capture_output=True)
        print("✓ DNS cache flushed")
    except Exception as e:
        print(f"⚠️  Could not flush DNS cache: {e}")

def open_browser(url, browser='default', private=False):
    """Open URL in specified browser"""
    time.sleep(0.5)
    
    if browser == 'safari':
        if private:
            applescript = f'''
            tell application "Safari"
                activate
                tell application "System Events"
                    keystroke "n" using {{command down, shift down}}
                end tell
                delay 0.5
                set URL of document 1 to "{url}"
            end tell
            '''
            subprocess.run(['osascript', '-e', applescript])
            print("🔒 Opened in Safari Private Browsing")
        else:
            subprocess.run(['open', '-a', 'Safari', url])
            
    elif browser == 'chrome':
        if private:
            print("⚠️  Chrome doesn't support opening in incognito via command line")
            print("   Opening in regular mode. Use Safari for private browsing support.")
        subprocess.run(['open', '-a', 'Google Chrome', url])
        
    else:
        import webbrowser
        webbrowser.open(url)

if __name__ == '__main__':
    kill_port(PORT)
    
    # Check and add hosts entry if needed
    hosts_configured = add_hosts_entry(CUSTOM_DOMAIN)
    
    # Flush DNS cache if we added new entries
    if hosts_configured:
        flush_dns_cache()
    
    local_ip = get_local_ip()
    
    print(f"\n{'='*60}")
    print(f"Starting server on port {PORT}")
    print(f"{'='*60}")
    
    if hosts_configured:
        print(f"Custom domain:   http://{CUSTOM_DOMAIN}:{PORT}")
        url = f"http://{CUSTOM_DOMAIN}:{PORT}"
    else:
        print(f"⚠️  Using localhost (custom domain setup failed)")
        url = f"http://localhost:{PORT}"
    
    print(f"Localhost:       http://localhost:{PORT}")
    print(f"Network access:  http://{local_ip}:{PORT}")
    
    if PRIVATE_MODE and BROWSER == 'safari':
        print(f"Mode:            🔒 Private Browsing")
    
    print(f"{'='*60}")
    print("Press Ctrl+C to stop\n")
    
    try:
        from threading import Thread
        server = HTTPServer((HOST, PORT), NoCacheHandler)
        
        Thread(target=lambda: open_browser(url, BROWSER, PRIVATE_MODE), daemon=True).start()
        
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
    except OSError as e:
        if e.errno == 48:
            print(f"\nPort {PORT} is still in use. Trying force kill...")
            subprocess.run(f'lsof -ti:{PORT} | xargs kill -9', shell=True)
            print("Please run the script again")
        else:
            raise
