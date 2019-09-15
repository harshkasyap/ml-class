"""Store some numbers."""
import json
numbers = {'name': 'abhinav', 'surname': 'anand'}
filename = 'numbers.json'
with open(filename, 'w') as f_obj:
  json.dump(numbers, f_obj)