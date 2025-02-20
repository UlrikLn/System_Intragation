import datetime
print(datetime.datetime.now());


from datetime import datetime # Smartere end det ovenstående
print(datetime.now());

print(datetime.now().strftime("%Y-%m-%dT%H:%M:%S")); # Bedre formatering
