# encoder
import base64

hej = "Hello World"

print(hej)

encoded = base64.b64encode(hej.encode())

print(encoded)

# decoder
decoded = base64.b64decode(encoded).decode()

print(decoded)

# with python build in function
text = "Hello, Worldåææ!"
encoded_text = text.encode()  
print(encoded_text) 

decoded_text = encoded_text.decode()
print(decoded_text)