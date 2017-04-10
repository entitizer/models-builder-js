'use strict';

const sizeof = require('object-sizeof');
const EntityBuilder = require('../lib').EntityBuilder;
const wikiEntity = require('wiki-entity');
const assert = require('assert');

describe('object size', function () {
    it('WikiEntity/Entity size (Albert Einstein)', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q937', claims: 'item', types: true, extract: 3, redirects: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const wikiEntity = entities[0];
                const entity = EntityBuilder.fromWikiEntity(wikiEntity, lang);
                const wikiEntitySize = sizeof(wikiEntity);
                const entitySize = sizeof(entity);

                console.log('wikiEntitySize: ', wikiEntitySize / 1000, 'KB');
                console.log('entitySize: ', entitySize / 1000, 'KB');
                // const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                // assert.equal('Adrian Ursu', entity.name);
                // assert.equal('Q18548924', entity.wikiId);
                // assert.equal('H', entity.type);

                // console.log(entity.toJSON());
            });
    });

});