# Japdl
Japdl est un programme pour télécharger les mangas de japscan. Pour l'instant, il n'est pas possible de télécharger les webtoons quand toutes les pages d'un chapitre sont sur la même page japscan.

Quelle est la différence avec [l'autre programme `Japdl`](https://github.com/Seysa/japdl) ? Celui-ci est un programme avec une interface graphique <small><small>(GUI en anglais)</small></small> au lieu d'une interface en ligne de commande. Il est donc recommandé d'utiliser cette version.

# Téléchargement
[Cliquez ici pour télécharger la dernière version](https://github.com/Seysa/japdl-gui/releases "Dernière version")

Selectionnez la version de votre choix. La dernière version sera marquée `Latest` en ![#3fb950](https://via.placeholder.com/15/3fb950/000000?text=+) à droite de la version.
A l'intérieur de cette version se trouve une catégorie `Assets` où sont disponibles au téléchargement les fichiers pour installer le programme.
# Que télécharger ?
## Pour windows:
- Une version `.exe` "setup" qui s'installe comme un programme windows simple. Windows signalera que l'éditeur du programme n'est pas reconnu: c'est normal, pas d'inquiétude. Le code source est accessible et la manière de créer les programmes est transparente.
-  Une archive `.zip` qui contient tout le programme et qui n'a pas besoin d'être installée.

## Pour linux:
- Une version `.AppImage` qui contient tout le programme en 1 fichier, facile à lancer (```./japdl-gui-<version>.appImage```)
- Une version `.rpm` pour les distributions linux basées sur RedHat linux
- Une version `.deb` pour les distributions linux basées sur Debian

Toutes les versions sont générées automatiquement pour linux et windows.

# Installation

- Si vous avez téléchargé une archive `.zip`, il suffit d'extraire le contenu de l'archive puis de lancer l'exécutable dans les fichiers extraits.
## Pour windows:
- Si vous avez téléchargé la version `.exe`, lancez le programme. Il vous guidera dans son installation.
## Pour linux:
- Si vous avez téléchargé la version `.appImage`, il suffit de l'exécuter.
- Si vous avez téléchargé la version `.deb` ou `.rpm`, installez l'application comme n'importe quel programme de ce type sur votre distribution linux.
# Pour les développeurs
## Installer les dépendances
```
npm ci
```
## Le lancer
```
npm start
```