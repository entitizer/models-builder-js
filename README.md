# entitizer.models-builder

Entitizer models builder module.

## Usage

```
import { getEntities } from 'wiki-entity';
import { EntityBuilder } from 'entitizer.models-builder';

const language = 'en';
// get Europe by title
getEntities({ language, titles: 'Europe' })
    .then(entities => {
        const wikiEntity = entities[0];
        // convert WikiEntity to an Entitizer Entity model
        const entity = EntityBuilder.fromWikiEntity(wikiEntity, language);
    });
```
