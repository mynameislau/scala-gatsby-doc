---
title:  "Javascript"
---



Principes généraux
------------------




### Linting


Un linter est mis en place sur chaque projet. (ESLint)   
*A définir : impossibilité de builder si erreur*   
Un fichier de configuration présent sur chaque projet permet de définir les options et règles du linter   
http://eslint.org/




### Bonnes pratiques


Plutôt que les boucles `for`, utilisez lorsque cela est possible les fonctions de l'objet Array (forEeach, map, filter etc...)




### ES6


Dans le cadre d'un projet utilisant ES6, et en plus des règles de linting en place, observez les règles suivantes :


 - Abandonnez complètement l'utilisation de `var` au profit de `const` et `let`.

 - Utilisez `const` par défaut et `let` uniquement dans le cas où vous savez qu'une variable va être réassignée. Au delà des optimisations de performance, cela permettra à un développeur repassant sur votre code  
 d'avoir une meilleure compréhension de celui-ci.

 - Utilisez par défaut des arrow functions ` () => { ... } ` en lieu et place des `function`. Utilisez `function` uniquement si vous souhaitez explicitement utiliser la valeur de `this` au sein de cette fonction.




### Lisibilité du code


Le code est la principale source de documentation. En plus des règles de linting en place, tentez de rédiger du code auto-documenté.   


- Choisissez des noms le plus explicite possible pour vos variables (verbes pour les fonctions dans la mesure du possible).   


- N'hésitez pas à remplacer une expression complexe par une variable ou une fonction   


  Exemple :


  au lieu de  :


  ```javascript
  if (element.offsetWidth < maxWidth && element.offsetHeight < maxHeight) {
    ...
  }
  ```

  utilisez :  

  ```javascript
  const isVisible =  element.offsetWidth < maxWidth && element.offsetHeight <   maxHeight;

  if (isVisible) { ... }
  ```


  voir :

  ```javascript
  const isVisible = elm => elm.offsetWidth < maxWidth && elm.offsetHeight;

  if (isVisible(theElement)) { ... }
  ```


- Scindez votre code en petits blocs de fonctions au rôle bien défini et au nom équivoque. Evitez les fonctions effectuant trop d'opérations différentes.


- Utilisez autant de fonctions pures que possible (http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/)


- Commentez uniquement si le bout de code n'est pas d'une lisibilité évidente mais qu'il n'est pas possible de faciliter la compréhension du code autrement qu'en commentant.




### Tests TDD / BDD


(A définir, dépend du type de projet : *Sur les projets comportant des tests, ceux-ci sont rédigés à l'aide de la librairie Tape   
https://github.com/substack/tape*)






### Polyfilling


Certaines fonctionnalités ES5 ne sont pas prises en charge par les anciens navigateurs. Elles peuvent être cependant "patchées" via des polyfills.   


Quelques librairies :   


- https://github.com/zloirock/core-js   
- Pour usage avec Babel : https://github.com/babel/babel/tree/master/packages/babel-polyfill   
- Polyfill DOM : https://github.com/WebReflection/dom4




Dans le contexte d'un site internet
-----------------------------------




### Progressive enhancement & Graceful degradation


**Utilisation de Modernizr** : Privilégier au maximum la détection des fonctionnalités supportées par le navigateur plutôt que le type de navigateur. Modernizr permet de faire ces détections.


En règle générale, toujours confronter la solution retenue pour implémenter la fonctionnalité *xy* avec la liste des navigateurs supportés vendue pour ce projet.
Prévoir une version améliorée pour les navigateurs récents ou dégradée pour les navigateurs anciens. Toujours vérifier avec le chef de projet que la stratégie envisagée est acceptable.


Au delà de toute contrainte graphique etc., le site doit être à minima **consultable** et **fonctionnel** si JavaScript est désactivé :
- **consultable** : l'entièreté du contenu du site doit être affiché à l'écran, y compris les parties qui seraient autrement masquées via du JS. Pas de propriété display:none, left:-9999px etc. sur les éléments si JS n'est pas activé.


- **fonctionnel** : Les fonctionnalités majeures et mineures du projet doivent être déterminées au démarrage du projet. Les fonctionnalités majeures comme par exemple la navigation au sein du site doivent être accessibles javascript désactivé.


Utiliser l'attribut `class` de la balise `<html>` pour renseigner les différentes étapes du cycle de vie d'une page HTML et utiliser ces classes pour afficher conditionnellement les éléments de la page.   


Exemple :  
  - dom-not-ready : le dom de la page n'est pas parsé.
  - dom-interactive : le dom est parsé et manipulable.
  - loading / loaded : l'évenement 'load' de la page s'est déclenché ou non




### Accessibilité


#### Attributs ARIA
Si vos scripts rafraîchissent le contenu de la page ou masquent / révèlent du contenu via CSS, appuyez votre développement sur les attributs ARIA (accessible rich internet application).   
Exemple : Un bouton passe en état selectionné. Plutôt que d'ajouter une classe `xxyy--active` ou `xxyy--selected`, utilisez l'attribut `aria-selected`.   


https://www.w3.org/TR/wai-aria/   
http://a11yproject.com/posts/getting-started-aria/




### Maintenabilité

- Toujours encapsuler le code dans des fonctions immédiatement invoquées
  (IIFE : http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
  De cette manière on ne pollue pas inutilement le namespace global (`window`) en créant des variables globales par inadvertance.


- Les namespaces (**à définir**)
  - Option A : Utiliser une gestion primitive des namespace en créant un seul point d'entrée sur window (ex: `window.scala`) et rajouter ensuite des sous namespaces à partir de là.
  - Option B : Utiliser un packager de modules type webpack (Todo : comment gérer le découpage / inclusion des scripts en asynchrone de cette manière).


- Utilisez le pattern Module si vous souhaitez exposer une partie d'un ensemble de méthodes tout en conservant une partie "privée".   
https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript   


  *Possibilité :* Inclure votre Module dans un namespace de cette manière :

  ```javascript

  (function (scala) {

    const maFonctionPrivee = () => { ... }

    scala.monModule = {
      maFonctionPublique: () => {
        // peut notamment utiliser maFonctionPrivee
      },

      // BEGIN TEST API
      /* si, dans le cadre d'éventuels tests  
      vous avez besoin de tester certaines  
      fonctions qui ne font pas partie de l'api publique,  
      exposez les simplement de la même manière que  
      les méthodes publiques en pensant à le notifier  
      via des commentaires*/
      autreFonctionPrivee: () => { ... }
      // END TEST API
    }
  }(window.scala || {}));

  ```


- Utiliser le mode strict (`'use strict'`) en phase de développement, pas en production.


- Compartimenter les différents scripts au maximum (une grande fonctionnalité = un fichier).   
  Exemple : vous souhaitez effectuer un traitement particulier sur les inputs de type date sur le site, créez un fichier `dates.js`   
  De manière général, faites en sorte autant que possible que chaque fichier soit indépendant des autres et indépendant de l'ordre d'exécution des scripts. Il sera cependant incontournable de charger certains scripts dans un ordre particulier (dépendances, librairies etc.)




- Attention pas de répétition de code : toute fonction d'ordre général et "bas niveau" ne doit pas se retrouver dans un module spécifique du site. Les modules propres au projet ne doivent comporter que du code spécifique au projet.   
Extraire ces fonctions dans des fichiers particuliers (ex : string-utils.js) et les appeler via namespace ou import module.


- Manipulation des classes CSS : Utiliser uniquement l'attribut `class` pour renseigner des classes exploitées **dans le CSS** pas pour un usage uniquement javascript. Une classe CSS ne doit pas être un point d'accroche pour un script JS.
Pour tout autre usage utiliser les attributs `data-xxyy`.


- Utilisez le principe de l'event delegation (https://davidwalsh.name/event-delegate)


- Evitez de stopper la propagation d'un évènement (via `event.stopImmediatePropagation`, `event.preventDefault`, ou `return false`)


- Ne pas utiliser javascript pour rajouter directement du style inline sur les éléments.   
Exemple `element.style.height = '913px';`   
Ne pas utiliser JQuery.hide, JQuery.show etc.   
Rajoutez plutôt des classes dans l'attribut `class` à la volée, qui se chargeront elle-même de gérer l'apparence via CSS.


- Et par extension, **ne jamais utiliser javascript pour régler des problèmes de layout / positionnement**. Utiliser CSS.




### Lisibilité


En plus des conseil d'ordre général, préfixez du signe $ les objets JQuery. Exemple : `$entries = $('#ma-liste > li');`




### Performances


- Placement des balises scripts :   
  Essayez de privilégier au maximum l'inclusion de vos scripts selon cet ordre de priorité :


  - **Juste avant la fermeture du body, et avec les attributs async et defer** Le script sera chargé en asynchrone aussitôt qu'il sera téléchargé.
  Cette méthode permet à la page de poursuivre son exécution.   
  `defer` permet de reléguer le chargement et l'execution du script à la fin du parsing de la page sur les navigateur ne supportant pas `async`.


  - **Juste avant la fermeture du body, sans attribut async**, les script
  ne retarderont pas l'affichage de la page et serons téléchargés et executés dans l'ordre.


  - **Dans le `<head>` de la page**, retarde l'affichage de la page.

- Retardez l'execution de votre code autant que possible afin d'éviter de bloquer le rendu de la page. Enveloppez par exemple votre code dans une evenement `load` de la page ou quand l'état du document est `ready`   
http://calendar.perfplanet.com/2016/prefer-defer-over-async/


- Attention à la manipulation du DOM. Insertion, suppression de nœuds etc. peuvent s'avérer gourmands en performance.
Être vigilant quant aux performances des scripts tierces utilisés.
Si-ne modification intensive du DOM est nécessaire dans le cadre de l'implémentation d'une fonctionnalité particulière du site, envisager l'utilisation d'une librairie légère spécialisée dans le traitement du DOM. (Ex: librairie vdom type Vuejs).
Être également vigilant quant aux propriétés css contrôlées par javascript, qui peuvent entraîner des chutes importantes de performance.
Liste des causes de Repaint / Reflow
https://gist.github.com/paulirish/5d52fb081b3570c81e3a


### Pour les projets compatibles IE9 et inférieur


Afin de limiter au maximum les mauvaises surprises, utiliser JQuery autant que faire se peut.
De la même manière, privilégier l'utilisation de plugins JQuery lors des choix de plugins tierces.




Package Management
------------------


Le package manager NPM est utilisé pour la gestion des dépendances.   


Installer les versions **exactes** des dépendances (variable de configuration définie ou à définir dans le fichier .npmrc du projet).   
https://docs.npmjs.com/misc/config


Spécifiez les version de Node et NPM nécessaires à l'exécution du projet.
https://docs.npmjs.com/files/package.json#engines   


Utilisez https://npms.io/ pour rechercher les packages et vérifier la robustesse / qualité du projet.


Mettre en place shrinkwrap à chaque initialisation de projet : `npm shrinkwrap`   
https://docs.npmjs.com/cli/shrinkwrap   
Le fichier shrinkwrap.json doit s'actualiser automatiquement à chaque ajout de dépendance.
