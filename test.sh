result=$(curl -s  http://127.0.0.1:9933 -H 'Content-Type: application/json' -d "{\"id\":1, \"jsonrpc\":\"2.0\", \"method\":\"eth_getBalance\", \"params\":[\"$line\"]}" | jq '.result' | sed -e 's/^"//' -e 's/"$//') 
decimal=$(printf '%d\n' $result)
