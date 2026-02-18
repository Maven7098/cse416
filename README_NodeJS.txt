// We need the following to be implemented in D3:

BarChart: need distribution (in JSON format) and max: number of congressional districts (in integer)
GA has 14 congressional districts ([], 14)
IA has 4 congressional districts ([], 4)

UI Ideas:
Top Buttons:
Current - Voting Rights Act (VRA-Conscious)* - Race-Blind Redistricting (w/o VRA)
s^state (using statewide weighted scores) only (may introduce more ensembles as the project progresses)
Top Left:
Implement Chloropleth Display for Population for each district (Choose the race/language minority)*
Options: Black - Hispanic - Asian American
Top Right:
IF NO DISTRICT was selected from Top Left
Implement BarChart for Population for all districts
GET ID from DISTRICT from Top Left
Display District Number
Population is paired with District Number (Not sure about chart type)

Bottom:
Box-and-Whisker Chart for Districts (sort districts of population in minority of choice from least to most)*
/There is a fixed population for minority of a given choice, but in ensembles they are given in distributions.
/For this one for now, there is no distribution, so only dots may exist.
/Those dots may or may not be kept later down the line.
For now, I can allocate district numbers, but keep in mind that in ensembles to be generated later,
they do not represent any geographical region, and those districts are not numbered.

Things to add to GeoJSON:
"ID": 2,
"AREA": 10982.3544,
"DISTRICT": "1",
"POPULATION": 797584, <- Total
"IDEAL_VALU": 797592, <- Total of POPULATION between Districts / District Number, rounding up
"DEVIATION": -8, <- | POPULATION - IDEAL_VALU |
"F_DEVIATIO": -0.00001, <- I don't understand this data.
"DISTRICT_L": "1|-0%" <- I don't understand this data.

Total - POPULATION
Not Hispanic or Latino
American Indian or Alaska Native Alone <- POP_IN
Asian Alone <- POP_AS
Black or African American Alone <- POP_AA
Native Hawaiian or Other Pacific Islander Alone <- POP_PI
White Alone <- POP_WH

# How can I parse multiple-racial people? Should I add them into both races
# or should I just jumble them together as 2+ races?
American Indian or Alaska Native and White
Asian and White
Black or African American and White
American Indian or Alaska Native and Black or African American
Remainder of Two or More Race Responses
Hispanic or Latino

# Presently, tot_est (+- moe) is used for districting.
# What other kinds of data do we need, though?
tot_est: The rounded estimate of the total number of people for that geographic area and
group.
tot_moe: The margin of error for the total number of people for that geographic area and
group.
adu_est: The rounded estimate of the total number of people 18 years of age or older for
that geographic area and group.
adu_moe: The margin of error for the total number of people 18 years of age or older for
that geographic area and group.
cit_est: The rounded estimate of the total number of United States citizens for that
geographic area and group.
cit_moe: The margin of error for the total number of United States citizens for that
geographic area and group.
cvap_est: The rounded estimate of the total number of United States citizens 18 years of
age or older for that geographic area and group.
cvap_moe: The margin of error for the total number of United States citizens 18 years of
age or older for that geographic area and group.

Input Strategy:
Skip 1st line
2nd line: total
3rd line: hispanic = total - hispanic
4th line: indigenous native
5th line: asian
6th line: black / aa
7th line: pacific islander
8th line: white
Sum the remaining line until next district: 2+ races