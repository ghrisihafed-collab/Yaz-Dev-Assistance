# 🚀 Yaz Dev Assistance - Manuel d'Installation & Utilisation

**Version :** 1.0.0  
**Auteur :** Hafed El Ghrissi  
**Type :** Application Portable Cross-Platform (Windows, macOS, Linux)

---

## 📋 Présentation

Yaz Dev Assistance est votre tableau de bord personnel intelligent, conçu pour fonctionner sans installation complexe. Il regroupe vos outils essentiels dans une interface moderne et multilingue.

### Fonctionnalités Clés
*   **✅ Gestion de Tâches :** To-do list intelligente avec sauvegarde automatique locale (SQLite).
*   **🌍 Cartographie :** Recherche de lieux et navigation mondiale (OpenStreetMap).
*   **📰 Actualités :** Flux d'informations en temps réel filtré par langue.
*   **📈 Économie :** Suivi des marchés (Bourse, Crypto) et devises.
*   **🗣️ Multilingue :** Support natif Anglais, Français, Allemand et **Arabe (RTL complet)**.
*   **🔒 Privé :** Toutes vos données (tâches, clés API) restent stockées localement sur votre machine.

---

## 💻 Guide d'Installation et de Lancement

Cette application est **portable**. Cela signifie qu'elle ne nécessite pas d'installation lourde. Vous lancez simplement le fichier exécutable.

### 🐧 Linux (Ubuntu, Debian, Fedora...)
Le format utilisé est **.AppImage**. C'est un format universel pour Linux.

1.  Localisez le fichier : `Yaz Dev Assistance-0.1.0.AppImage` (dans le dossier `release`).
2.  Faites un clic droit sur le fichier -> **Propriétés**.
3.  Allez dans l'onglet **Permissions** et cochez **"Autoriser l'exécution du fichier comme un programme"** (ou via le terminal : `chmod +x Yaz*.AppImage`).
4.  Double-cliquez pour lancer.

### 🪟 Windows (10/11)
Le format utilisé est un exécutable **.exe** portable.

1.  Copiez le fichier `Yaz Dev Assistance 0.1.0.exe` sur votre bureau ou dans un dossier de votre choix.
2.  Double-cliquez pour lancer.
3.  *Note : Comme l'application n'est pas signée numériquement (payant), Windows Defender peut afficher "Windows a protégé votre ordinateur". Cliquez sur "Informations complémentaires" -> "Exécuter quand même".*

### 🍎 macOS (Intel & Apple Silicon)
Le format est une image disque **.dmg**.

1.  Ouvrez le fichier `.dmg`.
2.  Glissez l'icône **Yaz Dev Assistance** dans votre dossier **Applications**.
3.  Lancez l'application depuis le Launchpad.
4.  *Note sécurité : Au premier lancement, macOS peut bloquer l'app car le développeur n'est pas vérifié. Allez dans "Préférences Système" -> "Sécurité et confidentialité" -> "Ouvrir quand même".*

---

## ⚙️ Configuration Initiale (Clés API)

Pour que les onglets **Actualités** et **Économie** fonctionnent, vous devez fournir vos propres clés API gratuites. L'application est conçue ainsi pour rester gratuite et privée.

1.  Lancez l'application.
2.  Cliquez sur l'icône **Paramètres (Engrenage)** en haut à droite.
3.  Entrez les clés suivantes (des liens sont fournis dans l'application pour les obtenir gratuitement) :
    *   **NewsAPI :** Pour les actualités mondiales.
    *   **Alpha Vantage :** Pour les données boursières et devises.
    *   **OpenWeatherMap :** (Optionnel) Pour la météo future.
4.  Cliquez sur **Save Keys**.

Vos clés sont cryptées et stockées uniquement sur votre ordinateur dans le fichier `user_data.db`.

---

## 🛠️ Compilation depuis le code source

Si vous souhaitez modifier l'application ou la recompiler pour une autre architecture.

**Prérequis :**
*   Node.js (v18 ou supérieur)
*   npm

**Commandes :**

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en mode développement (pour tester)
npm run electron:dev

# 3. Construire l'exécutable pour votre système actuel
npm run build
```

Les fichiers générés se trouveront dans le dossier `release/`.

---

**Développé avec passion par Hafed El Ghrissi.**
*Stack : Electron, React, TypeScript, SQLite, TailwindCSS.*