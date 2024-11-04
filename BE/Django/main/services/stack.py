class Stack:
    def __init__(self):
        self.stack = []

    def push(self, item):
        self.stack.append(item)

    def pop(self):
        if not self.is_empty():
            return self.stack.pop()
        raise IndexError("Stack is Empty")

    def peek(self):
        if not self.is_empty():
            return self.stack[-1]
        raise IndexError("Stack is Empty")
    
    def is_empty(self):
        return len(self.stack) == 0
    
    def size(self):
        return len(self.stack)