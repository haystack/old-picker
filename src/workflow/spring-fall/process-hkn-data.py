"""
process-hkn-data.py

number
instructor_name
rating
term_season	term_year
overall_rating
diff_rating
hours 

"difficulty" :      "2.9",
"hours" :           "13.6",
"label" :           "Rating-6.163",
"term" :            "Spring 2007",
"type" :            "Class-Rating",
"rating" :          "5",
"class-rating-of" : "6.163"

"professor" :           "J.Weng",
"label" :               "Rating-6.887-1",
"professor-rating-of" : "6.887",
"term" :                "Spring 2007",
"type" :                "Professor-Rating",
"professor-rating" :    "6"

"""
term = "Fall 2007"

csv = open('hkn.csv', 'r')
json = open('../../webapp/data/hkn.json', 'w')

items = []
professors = {}

csv.readline() # ignore first line
for line in csv:
    data = line.split(',')
    id = data[0].split('/')[0]
    if id in professors:
        professors[id] = professors[id] + 1
        items.append('{"professor":"'+data[1]+'",\
"label":"Rating-'+id+'-'+str(professors[id])+'",\
"professor-rating-of":"'+id+'",\
"term":"'+term+'",\
"type":"Professor-Rating",\
"professor-rating":"'+data[2]+'"}')
    else:
        professors[id] = 1 
        items.append('{"professor":"'+data[1]+'",\
"label":"Rating-'+id+'-'+str(professors[id])+'",\
"professor-rating-of":"'+id+'",\
"term":"'+term+'",\
"type":"Professor-Rating",\
"professor-rating":"'+data[2]+'"}')
        items.append('{"difficulty":"'+data[6]+'",\
"hours":"'+data[7].strip()+'",\
"label":"Rating-'+id+'",\
"term":"'+term+'",\
"type":"Class-Rating",\
"rating":"'+data[5]+'",\
"class-rating-of":"'+id+'"}')

json.write('{"items":['+','.join(items)+']}')
csv.close()
json.close()