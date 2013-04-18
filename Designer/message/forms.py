from django import forms

class MsgPostForm(forms.Form):
    title = forms.CharField(label='Title', widget=forms.TextInput(attrs={'size':30,'max_length':30}))
    content = forms.CharField(label='Content',widget=forms.Textarea(attrs={'size':10000}))
    