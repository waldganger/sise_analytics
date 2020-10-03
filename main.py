import json, requests, functools, operator


# ---------- get json from API and write it in ----------
url = "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-sise-effectifs-d-etudiants-inscrits-esr-public&q=&rows=4841&facet=rentree_lib&facet=etablissement_type2&facet=etablissement_type_lib&facet=etablissement_lib&facet=identifiant_eter&facet=champ_statistique&facet=operateur_lib&facet=localisation_etab&facet=localisation_ins&facet=bac_lib&facet=attrac_intern_lib&facet=dn_de_lib&facet=cursus_lmd_lib&facet=diplome_lib&facet=niveau_lib&facet=disciplines_selection&facet=gd_disciscipline_lib&facet=discipline_lib&facet=sect_disciplinaire_lib&facet=reg_etab_lib&facet=com_ins_lib&facet=uucr_ins_lib&facet=dep_ins_lib&facet=aca_ins_lib&facet=reg_ins_lib&refine.rentree_lib=2018-19&refine.etablissement_lib=Universit%C3%A9+de+Pau+et+des+Pays+de+l%27Adour"

def json_fetch(url, ouputFileName):
    response = json.loads(requests.get(url).text)

    with open (ouputFileName, 'w') as outfile:
        json.dump(response, outfile)
    response.raise_for_status()

# ---------- Loads relevant JSON part (array of records['fields'] only) from file and bind it in variable ----------
def json_bind(file):
    resultat = []
    with open(file) as json_file:
        data = json.load(json_file)
        for el in data['records']:
            for cle in el.keys():
                if cle == "fields":
                    resultat.append(el[cle])
    return resultat

def get_fte(data):
    return functools.reduce(operator.add, map(lambda el: el['effectif'], data))

def get_all_disciplines(data):
    result = set()
    for discipline in map(lambda el: el["sect_disciplinaire_lib"], data):
        result.add(discipline)
    return result

def get_fte_by_discipline(data, discipline):
    result = filter(lambda el: el["sect_disciplinaire_lib"] == discipline, data)
    return get_fte(result)

def get_fte_by_disciplines(data):
    resultat = {}
    for discipline in get_all_disciplines(data):
        resultat[discipline] = get_fte_by_discipline(data, discipline)
    return resultat

data = json_bind('sise.json')



# print(get_fte(data))
# print(get_all_disciplines(data))
# print(get_fte_by_discipline(data, "Informatique"))
# print(get_fte_by_disciplines(data))
for key, value in get_fte_by_disciplines(data).items():
    print(f"{key}:\t{value}")