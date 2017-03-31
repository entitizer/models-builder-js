
// const debug = require('debug')('models-builder');
import { WikiEntity, WikidataPropertyValue } from 'wiki-entity';
import { Entity } from 'entitizer.models';
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
import * as _ from 'lodash';
import { getEntityData } from './getEntityData';

export function wikiEntityToEntity(wikiEntity: WikiEntity, lang: string): Entity {
    // debug('wikiEntityToEntity:', lang, wikiEntity);
    const entity = Entity.create();
    entity.lang = lang.toLowerCase();
    entity.wikiId = wikiEntity.id;
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
    }
    if (wikiEntity.types) {
        entity.types = _.uniq(wikiEntity.types.filter(item => !/:(Thing|Agent)$/.test(item)));
    }
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.wikiPageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    if (wikiEntity.sitelinks) {
        entity.wikiTitle = wikiEntity.sitelinks[lang];
        if (lang !== 'en') {
            entity.enWikiTitle = wikiEntity.sitelinks.en;
        }
    }

    entity.aliases = wikiEntity.aliases || [];
    entity.aliases = entity.aliases.concat(wikiEntity.redirects || []);
    if (entity.aliases.length) {
        entity.aliases = _.uniqBy(entity.aliases, _.lowerCase);
    }

    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            // detect wikiImage
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
