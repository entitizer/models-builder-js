'use strict';

const EntityBuilder = require('../lib').EntityBuilder;
const wikiEntity = require('wiki-entity');
const assert = require('assert');

describe('EntityBuilder', function () {
    it('fromWikiEntity en:simple', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none' })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('P', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity ro:simple', function () {
        const lang = 'ro';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none' })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('Adrian Ursu (cântăreț)', entity.title);
                assert.equal('P', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity en:complex', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q937', claims: 'all' })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Albert Einstein', entity.name);
                assert.equal('Q937', entity.wikiId);
                assert.equal('P', entity.type);
                assert.equal('Q5', entity.data.P31[0].value);

                // console.log(entity.toJSON().data);
            });
    });
});
