import numpy as np

class Epsilon():
    def __init__(self):
        self.epsilon = 1
        self.max_epsilon = 1.0
        self.min_epsilon = 0.001
        self.decay_rate = 0.01  
    def get_epsilon(self):
        return self.epsilon

    def calculate_decay(self, episode):
        self.epsilon = self.min_epsilon + (self.max_epsilon - self.min_epsilon) * np.exp(-self.decay_rate * episode)

def update_qtable(qtable, state, action, reward, new_state):
    lr = 0.01
    gamma = 0.99
    return qtable[state, action] + lr * (reward + gamma * np.max(qtable[new_state, :]) - qtable[state, action])