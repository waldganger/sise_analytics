// const json = require('./sise.json');

// import * as json from "file://C:/Users/antony/OneDrive -/programmation/apprentissage/JS/sise.json";

// retourne les fte totaux

const url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public&q=&rows=4841&facet=rentree_lib&facet=etablissement_type2&facet=etablissement_type_lib&facet=etablissement_lib&facet=identifiant_eter&facet=champ_statistique&facet=operateur_lib&facet=localisation_etab&facet=localisation_ins&facet=bac_lib&facet=attrac_intern_lib&facet=dn_de_lib&facet=cursus_lmd_lib&facet=diplome_lib&facet=niveau_lib&facet=disciplines_selection&facet=gd_disciscipline_lib&facet=discipline_lib&facet=sect_disciplinaire_lib&facet=reg_etab_lib&facet=com_ins_lib&facet=uucr_ins_lib&facet=dep_ins_lib&facet=aca_ins_lib&facet=reg_ins_lib&refine.rentree_lib=2018-19&refine.etablissement_lib=Universit%C3%A9+de+Pau+et+des+Pays+de+l%27Adour"

console.log("Travail en cours... Merci de patienter.");

fetch(url)
    .then(response => response.json())
    .then(objet => { 
        const data = objet.records;
        // console.log(data);
        // console.log(fte(data));
        // console.log(listeFields(data));
        // console.log(listeDisciplines(data));
        // console.log(listeSite(data));
        // printFteByDiscipline(data);
        sortFteDisciplines(data);
        
    });

function fte(data){
    return Object.values(data).map(el => el.fields.effectif).reduce((sum, curr) => sum + curr, 0);
}

function listeFields(data){
    let set = new Set();
    for(let el of Object.values(data)){
        for (let f of Object.keys(el.fields)){
            set.add(f);
        }
    }
    return Array.from(set);
}

function listeDisciplines(data){
    let set = new Set;
    Object.values(data).map(el => set.add(el.fields.sect_disciplinaire_lib));
    return Array.from(set);
}

function listeSite(data) {
    let set = new Set;
    Object.values(data).map(el => set.add(el.fields.com_ins_lib));
    return Array.from(set);
}

function listeAllPropertiesValues(data){        
    let resultat = {};
    listeFields(data).map(prop => resultat[prop] = listePropertyValues(data, String(prop)));
    return resultat;
}

function listePropertyValues(data, property){
    let set = new Set;
    Object.values(data).map(el => set.add(el.fields[property]));
    return Array.from(set);
}

function fteDiscipline(data, disc){
    return Object.values(data).filter(el => el.fields.sect_disciplinaire_lib == disc)
    .map(el => el.fields.effectif)
    .reduce((sum, current) => sum + current, 0);
}

function printFteByDiscipline(data){
    console.table(
        listeDisciplines(data).map(disc => {
            return {
                "Discipline": disc,
                "FTE": fteDiscipline(data, disc)
            };
        }));
}

function sortFteDisciplines(data) {
    let resultat = [];
    listeDisciplines(data).map(disc => {
        resultat.push([disc, fteDiscipline(data, disc)]);
    })
    resultat.sort(([,a], [,b]) => b - a);

    resultat.forEach(element => {
        console.log(element[0] + " : " + element[1]);
    });
}



function totalFte(data){
    return listeDisciplines(data).map(disc => fteDiscipline(data, disc)).reduce((sum, current) => sum + current, 0);
}

// TESTS
// console.log(listeAllPropertiesValues(json));
// console.log(listeFields(json));
// console.log(listePropertyValues(json, "gd_disciscipline"));
// console.log(listeSite(json));
// printFteByDiscipline(json);
// console.log(totalFte(json) === fte(json));
// console.log(totalFte(json));
// console.log( fteDiscipline(json, 'Informatique') );
// Object.values(json).forEach(el => console.log(el));
// console.log(listeDisciplines(json));