
import { EntityTypeValue, IPlainObject, EntityTypes } from 'entitizer.models'
import { WikiEntity } from 'wiki-entity'
const ENTITY_TYPES: IPlainObject<string[]> = require('../data/entity_types.json');

export function getEntityType(wikiEntity: WikiEntity): EntityTypeValue {
    if (!wikiEntity.claims) {
        return null;
    }

    const type = getTypeByProp(wikiEntity, 'P31');
    if (type) {
        return type;
    }

    return getTypeByProp(wikiEntity, 'P279');
}


function getTypeByProp(wikiEntity: WikiEntity, prop: string): EntityTypeValue {
    const instanceOf = wikiEntity.claims[prop];

    if (!instanceOf) {
        return null;
    }

    // for every value of instanceOf:
    for (var i = 0; i < instanceOf.values.length; i++) {
        // value is Event
        if (~ENTITY_TYPES.E.indexOf(instanceOf.values[i].value)) {
            return EntityTypes.EVENT;
        }
        // value is Person
        if (~ENTITY_TYPES.H.indexOf(instanceOf.values[i].value)) {
            return EntityTypes.PERSON;
        }
        // value is Org
        if (~ENTITY_TYPES.O.indexOf(instanceOf.values[i].value)) {
            return EntityTypes.ORGANIZATION;
        }
        // value is Location
        if (~ENTITY_TYPES.L.indexOf(instanceOf.values[i].value)) {
            return EntityTypes.LOCATION;
        }
        // value is Product
        if (~ENTITY_TYPES.P.indexOf(instanceOf.values[i].value)) {
            return EntityTypes.PRODUCT;
        }
    }

    return null;
}
