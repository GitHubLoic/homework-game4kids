"""Petit serveur local pour jouer (ordinateur, iPhone ou iPad sur le même Wi-Fi).

Comme `python3 -m http.server`, mais demande au navigateur de toujours vérifier
s'il y a une nouvelle version des fichiers : pas de vieux jeu gardé en cache.
Lancer : python3 serve.py   (puis ouvrir http://<adresse-du-mac>:8765 sur le téléphone)
"""
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    http.server.ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
