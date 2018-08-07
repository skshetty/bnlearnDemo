curl -v -X POST \
	"http://localhost:3000/api/inference/coronary?X=41"\
	 -d @input.json\
	 -H "Content-type: application/json"

