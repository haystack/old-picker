"""
process-hkn-data.py

number
instructor_name
rating
term
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


Note: Expecting a CSV file representing multiple terms of HKN data,
    starting with the most recent semester and moving backward.
Want to keep ONLY the most recent terms' data.
"""
csv = open('hkn.csv', 'r')
json = open('../../webapp/data/hkn.json', 'w')

items = []
professors = {}
profCount = 1

csv.readline() # ignore first line
for line in csv:
    data = line.split(',')
    id = data[0].split('/')[0]
    id = data[0].split('J')[0]
    
    if id in professors: # term
        if professors[id] == data[3]:
            profCount += 1
            items.append('{"professor":"'+data[1]+'",\
"label":"Rating-'+id+'-'+str(profCount)+'",\
"professor-rating-of":"'+id+'",\
"term":"'+data[3]+'",\
"type":"Professor-Rating",\
"professor-rating":"'+data[2]+'"}')
    else:
        professors[id] = data[3]
        items.append('{"professor":"'+data[1]+'",\
"label":"Rating-'+id+'-'+str(professors[id])+'",\
"professor-rating-of":"'+id+'",\
"term":"'+data[3]+'",\
"type":"Professor-Rating",\
"professor-rating":"'+data[2]+'"}')
        items.append('{"difficulty":"'+data[5]+'",\
"hours":"'+data[6].strip()+'",\
"label":"Rating-'+id+'",\
"term":"'+data[3]+'",\
"type":"Class-Rating",\
"rating":"'+data[4]+'",\
"class-rating-of":"'+id+'"}')

json.write('{"items":['+','.join(items)+']}')
csv.close()
json.close()