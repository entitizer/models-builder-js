
import { WikiEntity, WikidataPropertyValue } from 'wiki-entity';
import { Entity } from 'entitizer.models';
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
import * as _ from 'lodash';
import { getEntityData } from './getEntityData';

export function wikiEntityToEntity(wikiEntity: WikiEntity, lang: string): Entity {

    const entity = Entity.create();
    entity.lang = lang.toLowerCase();
    entity.wikiId = wikiEntity.id;
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
    }
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.aliases = wikiEntity.aliases;
    entity.pageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    entity.title = wikiEntity.sitelinks && wikiEntity.sitelinks[lang];
    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            for (var i = 0; i < ids.length; i++) {
                const img: WikidataPropertyValue = _.find(wikiEntity.claims[ids[i]].values, { datatype: 'commonsMedia' });
                if (img) {
                    entity.wikiImage = img.value;
                    break;
                }
            }
            entity.data = getEntityData(wikiEntity, entity.type);
        }
    }

    return entity;
}
