
import { WikiEntity, WikidataPropertyValue } from 'wiki-entity';
import { Entity, EntityTypeValue, EntityData, IPlainObject } from 'entitizer.models';
import { getEntityType } from './getEntityType';
import * as _ from 'lodash';

export function wikiEntityToEntity(wikiEntity: WikiEntity, lang: string): Entity {

    const entity = Entity.create();
    entity.lang = lang.toLowerCase();
    entity.wikiId = wikiEntity.id;
    entity.type = getEntityType(wikiEntity);
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.aliases = wikiEntity.aliases;
    entity.pageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    entity.title = wikiEntity.sitelinks && wikiEntity.sitelinks[lang];
    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        for (var i = 0; i < ids.length; i++) {
            const img: WikidataPropertyValue = _.find(wikiEntity.claims[ids[i]].values, { datatype: 'commonsMedia' });
            if (img) {
                entity.wikiImage = img.value;
                break;
            }
        }
        entity.data = createEntityData(wikiEntity, entity.type);
    }

    return entity;
}

const ENTITY_DATA_PROPS: IPlainObject<string[]> = {
    // Person
    P: [
        // instance of
        'P31',
        // sex or gender
        'P21',
        // date of birth
        'P569',
        // occupation
        'P106',
        // country of citizenship
        'P27',
        // family name
        'P734',
        // father
        'P22',
        // mother
        'P25',
        // spouse
        'P26',
        // native language
        'P103',
        // position held
        'P39',
        // nickname
        'P1449',
        // IMDb ID
        'P345',
        // ISNI
        'P213',
        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // date of death
        'P570',
        // place of death
        'P20',
        // official website
        'P856'
    ]
};

function createEntityData(wikiEntity: WikiEntity, type: EntityTypeValue): EntityData {
    if (!wikiEntity.claims || !type) {
        return null;
    }
    const types = ENTITY_DATA_PROPS[type];
    if (!types) {
        return null;
    }
    const data: EntityData = {};

    for (var key in wikiEntity.claims) {
        if (~types.indexOf(key) && wikiEntity.claims[key].values.length) {
            data[key] = [];
            wikiEntity.claims[key].values.forEach(value => {
                const v: { value: string, label?: string } = { value: value.value_string || value.value.toString() };
                if (value.label && v.value !== value.label) {
                    v.label = value.label;
                }
                data[key].push(v);
            });
        }
    }

    return data;
}