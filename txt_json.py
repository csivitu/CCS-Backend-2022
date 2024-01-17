import json

def txt_to_json(txt_filename, json_filename):
    # Read emails from the text file
    with open(txt_filename, 'r') as txt_file:
        emails = [line.strip() for line in txt_file]

    # Create a dictionary with 'emails' as the key and the list of emails as the value
    data = emails

    # Convert dictionary to JSON format
    json_data = json.dumps(data, indent=2)

    # Write JSON data to a new file
    with open(json_filename, 'w+') as json_file:
        json_file.write(json_data)


input_txt_file = 'input.txt'

# Replace 'output.json' with the desired name of your output JSON file
output_json_file = 'enrolledlisttest.json'

# Convert the text file to JSON
txt_to_json(input_txt_file, output_json_file)

print(f"Conversion completed. JSON data saved to '{output_json_file}'.")
