#!/usr/bin/env python3
import os
import signal
import subprocess
import time
import socket
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 8888
BROWSER = 'safari'  # or 'chrome' or 'default'
PRIVATE_MODE = True  # Set to True for private browsing (Safari only)
HOST = '0.0.0.0'
CUSTOM_DOMAIN = 'dev.io'  # Change to your preferred domain

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
    """Check if domain is configured in /etc/hosts"""
    try:
        with open('/etc/hosts', 'r') as f:
            for line in f:
                if domain in line and not line.strip().startswith('#'):
                    return True
        return False
    except:
        return False

def add_hosts_entry(domain):
    """Add domain to /etc/hosts if not present"""
    if check_hosts_entry(domain):
        print(f"✓ Domain '{domain}' already configured in /etc/hosts")
        return True
    
    print(f"⚠️  Domain '{domain}' not found in /etc/hosts")
    print(f"Adding '127.0.0.1    {domain}' to /etc/hosts (requires sudo)...")
    
    try:
        cmd = f"echo '127.0.0.1    {domain}' | sudo tee -a /etc/hosts"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Successfully added '{domain}' to /etc/hosts")
            return True
        else:
            print(f"✗ Failed to add domain to /etc/hosts")
            return False
    except Exception as e:
        print(f"✗ Error adding domain: {e}")
        return False

def open_browser(url, browser='default', private=False):
    """Open URL in specified browser"""
    time.sleep(0.5)
    
    if browser == 'safari':
        if private:
            # Open Safari in private browsing mode
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
