"""
process-open-data.py

To convert class data from tab separated values to json.
Data has the following attributes:

0 TERM_CODE
1 TERM_DESCRIPTION
2 SCHOOL_NAME
3 DEPARTMENT
4 SUBJECT_ID
5 SUBJECT_TITLE
6 INSTRUCTOR_NAME
7 MATERIAL_TITLE
8 MATERIAL_AUTHOR_NAME
9 MATERIAL_ISBN
10 MATERIAL_PUBLISHER
11 MATERIAL_YEAR
"""

tsv = open('open-tb-data.txt', 'r')

courses = {}
courses['1'] = []
courses['2'] = []
courses['3'] = []
courses['4'] = []
courses['5'] = []
courses['6'] = []
courses['7'] = []
courses['8'] = []
courses['9'] = []
courses['10'] = []
courses['11'] = []
courses['12'] = []
courses['13'] = []
courses['14'] = []
courses['15'] = []
courses['16'] = []
courses['17'] = []
courses['18'] = []
courses['19'] = []
courses['20'] = []
courses['21'] = []
courses['21A'] = []
courses['21F'] = []
courses['21H'] = []
courses['21M'] = []
courses['21L'] = []
courses['21W'] = []
courses['22'] = []
courses['24'] = []
courses['AS'] = []
courses['CMS'] = []
courses['CSB'] = []
courses['ESD'] = []
courses['HST'] = []
courses['MAS'] = []
courses['MS'] = []
courses['NS'] = []
courses['PBS'] = []
courses['SP'] = []
courses['STS'] = []
courses['SWE'] = []
courses['SDM'] = []

for line in tsv:
    item = ['"type":"Textbook"']
    data = line.replace('"','&quot;').split('\t')
    if data[0][0:4] == '2009':
		# T + class number + ISBN
        item.append('"id":"T'+data[4]+data[9]+'"')

		# label = title of the book
        item.append('"label":"' + data[7] + '"')
        item.append('"class-textbook-of":"'+data[4]+'"')
        course = data[4].split('.')[0]
        item.append('"course":"'+course+'"')
#        item.append('"shortLabel":"'+data[5]+'"')
#        item.append('"in-charge":"'+data[6]+'"')
        item.append('"title":"'+data[7]+'"')
        item.append('"author":"'+data[8]+'"')
        item.append('"isbn":"'+data[9]+'"')
        item.append('"publisher":"'+data[10]+'"')
        item.append('"year":"'+data[11].strip()+'"')
        courses[course].append('{'+','.join(item)+'}')
for key in courses.keys():
    json = open('open-textbook-json/'+key+'.json', 'w')
    json.write('{"items":['+','.join(courses[key])+']}')
    json.close()

tsv.close()