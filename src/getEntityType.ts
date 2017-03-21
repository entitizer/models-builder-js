
import { EntityTypeValue, IPlainObject } from 'entitizer.models'
import { WikiEntity } from 'wiki-entity'
const ENTITY_TYPES: IPlainObject<string[]> = require('../data/entity_types.json');

export function getEntityType(wikiEntity: WikiEntity): EntityTypeValue {
    if (!wikiEntity.claims) {
        return null;
    }

    const instanceOf = wikiEntity.claims.P31;

    if (!instanceOf) {
        return null;
    }

    // for every value of instanceOf:
    for (var i = 0; i < instanceOf.values.length; i++) {
        // value is Event
        if (~ENTITY_TYPES.E.indexOf(instanceOf.values[i].value)) {
            return 'E';
        }
        // value is Person
        if (~ENTITY_TYPES.P.indexOf(instanceOf.values[i].value)) {
            return 'P';
        }
        // value is Org
        if (~ENTITY_TYPES.O.indexOf(instanceOf.values[i].value)) {
            return 'O';
        }
        // value is Location
        if (~ENTITY_TYPES.L.indexOf(instanceOf.values[i].value)) {
            return 'L';
        }
    }

    return null;
}
