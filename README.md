# AuthBaseBackend

Ce projet a été créé dans le cadre d'un cours d'architecture logicielle puis mis à jour pour un cours de web service.

## Description

Le projet est un backend de service Web qui fournit une API RESTful pour la gestion des utilisateurs et des fonctionnalités d'authentification. Il utilise Node.js avec Express.js comme framework principal et MariaDB comme base de données.

L'architecture du backend est décrite dans le fichier openapi.yml, qui spécifie les endpoints, les schémas de données, les modèles de réponse, etc.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Gestion des informations utilisateur (nom, adresse, téléphone, etc.)
- Réinitialisation de mot de passe
- Authentification basée sur les tokens JWT
- Validation de tokens JWT
- Envoi de mails

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- Docker
- Docker Compose

## Installation

1. Clonez ce repo sur votre machine locale.

2. À la racine du projet, exécutez la commande suivante pour démarrer les services :

docker-compose up

Cela lancera les conteneurs Docker pour MariaDB, Express et MailHog, et les configurera avec les paramètres nécessaires.

## Utilisation

Lorsque les conteneurs sont en cours d'exécution, vous pouvez accéder à l'API à l'adresse suivante :

http://localhost:8081/api/v1

## Documentation API

La documentation de l'API est disponible dans le fichier openapi.yml. Vous pouvez consulter ce fichier pour obtenir des informations détaillées sur les endpoints, les schémas de données, les modèles de réponse, etc.

## Auteur

Ce projet a été développé par [0pahh] ([@0pahh](https://github.com/0pahh)).

## Licence

Ce projet est sous licence MIT.
[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)
