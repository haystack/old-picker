"""
process-open-data.py

To convert class data from tab separated values to json.
Data has the following attributes:

0 ACADEMIC_YEAR
1 SUBJECT_ID
2 SUBJECT_CODE
3 SUBJECT_NUMBER
4 SOURCE_SUBJECT_ID
5 PRINT_SUBJECT_ID
6 IS_PRINTED_IN_BULLETIN
7 DEPARTMENT_CODE
8 DEPARTMENT_NAME
9 EFFECTIVE_TERM_CODE
10 SUBJECT_SHORT_TITLE
11 SUBJECT_TITLE
12 IS_VARIABLE_UNITS
13 LECTURE_UNITS
14 LAB_UNITS
15 PREPARATION_UNITS
16 TOTAL_UNITS
17 DESIGN_UNITS
18 GRADE_TYPE
19 GRADE_TYPE_DESC
20 GRADE_RULE
21 GRADE_RULE_DESC
22 HGN_CODE
23 HGN_DESC
24 HGN_EXCEPT
25 GIR_ATTRIBUTE
26 GIR_ATTRIBUTE_DESC
27 COMM_REQ_ATTRIBUTE
28 COMM_REQ_ATTRIBUTE_DESC
29 TUITION_ATTRIBUTE
30 TUITION_ATTRIBUTE_DESC
31 WRITE_REQ_ATTRIBUTE
32 WRITE_REQ_ATTRIBUTE_DESC
33 SUPERVISOR_ATTRIBUTE
34 SUPERVISOR_ATTRIBUTE_DESC
35 PREREQUISITES
36 SUBJECT_DESCRIPTION
37 JOINT_SUBJECTS
38 SCHOOL_WIDE_ELECTIVES
39 MEETS_WITH_SUBJECTS
40 EQUIVALENT_SUBJECTS
41 IS_OFFERED_THIS_YEAR
42 IS_OFFERED_FALL_TERM
43 IS_OFFERED_IAP
44 IS_OFFERED_SPRING_TERM
45 IS_OFFERED_SUMMER_TERM
46 FALL_INSTRUCTORS
47 SPRING_INSTRUCTORS
48 STATUS_CHANGE
49 LAST_ACTIVITY_DATE
50 WAREHOUSE_LOAD_DATE
"""

tsv = open('open-data.txt', 'r')

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
    item = ['"type":"Class"']
    data = line.split('\t')
    if data[0] == '2009':
        item.append('"id":"'+data[1]+'"')
        item.append('"course":"'+data[2]+'"')
        item.append('"label":"'+data[11]+'"')
        item.append('"shortLabel":"'+data[11]+'"')
        item.append('"units":"'+data[13].strip()+'-'+data[14].strip()+'-'+data[15].strip()+'"')
        item.append('"total-units":'+str(int(data[13])+int(data[14])+int(data[15])))
        item.append('"description":"'+data[36]+'"')
        item.append('"level":"'+data[23]+'"')
        item.append('"prereqs":"'+data[35]+'"')
        item.append('"grading":"'+data[19]+'"')
        item.append('"repeatable":"'+data[21]+'"')
        item.append('"ci":"'+data[28]+'"')
        item.append('"gir":"'+data[26]+'"')
        item.append('"joint":"'+data[37]+'"')
        item.append('"equivalent":"'+data[40]+'"')
        item.append('"offering":"'+data[41]+'"')
        semesters = []
        if data[42] == "Y": semesters.append("Fall")
        if data[43] == "Y": semesters.append("IAP")
        if data[44] == "Y": semesters.append("Spring")
        if data[45] == "Y": semesters.append("Summer")
        item.append('"semester":'+str(semesters))
        item.append('"in-charge":"'+data[46]+'"')
        courses[data[2]].append('{'+','.join(item)+'}')

for key in courses.keys():
    json = open('open-json/'+key+'.json', 'w')
    json.write('{"items":['+','.join(courses[key])+']}')
    json.close()

tsv.close()