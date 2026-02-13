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