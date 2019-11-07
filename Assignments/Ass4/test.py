import nltk

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

sentence = "They refuse to permit us to obtain the refuse permit."
tokens = nltk.word_tokenize(sentence)
print (tokens)
print (nltk.pos_tag(tokens))