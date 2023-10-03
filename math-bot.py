import tkinter as tk
from tkinter import ttk
import re
import math

class MathBotAppIntegrated(tk.Tk):
    def __init__(self):
        super().__init__()
        
        self.title("Math Bot")
        self.geometry("400x300")
        
        # Add widgets
        self.create_widgets()
        
    def create_widgets(self):
        # Input label
        ttk.Label(self, text="Enter your math question:").pack(pady=20)
        
        # Input field
        self.input_field = ttk.Entry(self, width=50)
        self.input_field.pack(pady=10)
        
        # Submit button
        self.submit_btn = ttk.Button(self, text="Submit", command=self.submit_query)
        self.submit_btn.pack(pady=10)
        
        # Display area for bot's response
        self.response_label = ttk.Label(self, text="", wraplength=350)
        self.response_label.pack(pady=20)
        
    def submit_query(self):
        user_input = self.input_field.get()
        response = self.math_chatbot(user_input)
        self.response_label.config(text=response)
        
    # The math bot functions from math-bot.py
    
    def parse_input(self, user_input):
        user_input = user_input.replace(" ", "").lower()

        if re.search(r'[+\-*/]', user_input):
            return 'arithmetic', user_input
        elif '%' in user_input or 'percent' in user_input:
            return 'percentage', user_input
        elif '^' in user_input or 'sqrt' in user_input or 'cubert' in user_input:
            return 'exponent_root', user_input
        elif any(func in user_input for func in ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']):
            return 'trigonometry', user_input
        elif any(func in user_input for func in ['log', 'ln', 'exp']):
            return 'log_exp', user_input
        else:
            return 'unknown', user_input
        
    def solve_arithmetic(self, expression):
        try:
            return eval(expression)
        except Exception as e:
            return str(e)
        
    def solve_percentage(self, expression):
        try:
            percent, value = re.findall(r'(\d+\.?\d*)', expression)
            return (float(percent) / 100) * float(value)
        except Exception as e:
            return str(e)
        
    def solve_exponent_root(self, expression):
        try:
            if '^' in expression:
                base, exponent = expression.split('^')
                return float(base) ** float(exponent)
            elif 'sqrt' in expression:
                return math.sqrt(float(expression.replace('sqrt(', '').replace(')', '')))
            elif 'cubert' in expression:
                return float(expression.replace('cubert(', '').replace(')', '')) ** (1/3)
        except Exception as e:
            return str(e)
        
    def solve_trigonometry(self, expression):
        try:
            value = math.radians(float(re.findall(r'(\d+\.?\d*)', expression)[0]))
            if 'sin' in expression:
                return math.sin(value)
            elif 'cos' in expression:
                return math.cos(value)
            elif 'tan' in expression:
                return math.tan(value)
            elif 'cot' in expression:
                return 1 / math.tan(value)
            elif 'sec' in expression:
                return 1 / math.cos(value)
            elif 'csc' in expression:
                return 1 / math.sin(value)
        except Exception as e:
            return str(e)
        
    def solve_log_exp(self, expression):
        try:
            value = float(re.findall(r'(\d+\.?\d*)', expression)[0])
            if 'log' in expression:
                return math.log10(value)
            elif 'ln' in expression:
                return math.log(value)
            elif 'exp' in expression:
                return math.exp(value)
        except Exception as e:
            return str(e)
        
    def math_chatbot(self, user_input):
        question_type, parsed_input = self.parse_input(user_input)
        if question_type == 'arithmetic':
            return self.solve_arithmetic(parsed_input)
        elif question_type == 'percentage':
            return self.solve_percentage(parsed_input)
        elif question_type == 'exponent_root':
            return self.solve_exponent_root(parsed_input)
        elif question_type == 'trigonometry':
            return self.solve_trigonometry(parsed_input)
        elif question_type == 'log_exp':
            return self.solve_log_exp(parsed_input)
        else:
            return "Sorry, I couldn't understand the question."

# Running the integrated GUI
if __name__ == "__main__":
    app = MathBotAppIntegrated()
    app.mainloop()
