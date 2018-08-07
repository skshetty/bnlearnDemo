curl -v -X POST \
	"http://localhost:5000/inference/coronary?ABC=456"\
	 -d @input.json\
	 -H "Content-type: application/json"

