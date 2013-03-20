from django import forms
import re
from homepage.models import User
from django.core.exceptions import ObjectDoesNotExist

class RegistrationForm(forms.Form):
    first_name = forms.CharField(label='First name', max_length=20)
    last_name = forms.CharField(label='Last name', max_length=20)
    username = forms.CharField(label='Username', max_length=30)
    email = forms.EmailField(label='E-mail')
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput())
    password2 = forms.CharField(label='Verify Password', widget=forms.PasswordInput())
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError('Should only include letter, number or _ in username!')
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            return username
        raise forms.ValidationError('Username already exists!')
    
    def clean_email(self):
        email = self.cleaned_data['email']
        try:
            User.objects.get(email=email)
        except ObjectDoesNotExist:
            return email
        raise forms.ValidationError('Email already exists!')
    
    def clean_password2(self):
        if 'password1' in self.cleaned_data:
            password1 = self.cleaned_data['password1']
            password2 = self.cleaned_data['password2']
            if password1 == password2:
                return password2
            raise forms.ValidationError('Passwords not match!')
            
class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30)
    password = forms.CharField(label='Password', widget=forms.PasswordInput())
    
    def clean_username(self):
        username = self.cleaned_data['username']
        if not re.search(r'^\w+$', username):
            raise forms.ValidationError('Noneffective username!')
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            raise forms.ValidationError('User doesn\'t exist!')
        return username
    
    def clean_password(self):
        if 'username' in self.cleaned_data:
            username = self.cleaned_data['username']
            user = User.objects.get(username=username)
            password = self.cleaned_data['password']
            if user.password == password:
                return password
            raise forms.ValidationError('Wrong password!')