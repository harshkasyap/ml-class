import numpy as np
import pandas as pd

# create state space and initial state probabilities
hidden_states = ['healthy', 'sick']
pi = [0.5, 0.5]
state_space = pd.Series(pi, index=hidden_states, name='states')
print(state_space)

# create hidden transition matrix
a_df = pd.DataFrame(columns=hidden_states, index=hidden_states)
a_df.loc[hidden_states[0]] = [0.7, 0.3]
a_df.loc[hidden_states[1]] = [0.4, 0.6]
print(a_df)
a = a_df.values

# Observation States
observable_states = ['sleeping', 'eating', 'pooping']
b_df = pd.DataFrame(columns=observable_states, index=hidden_states)
b_df.loc[hidden_states[0]] = [0.2, 0.6, 0.2]
b_df.loc[hidden_states[1]] = [0.4, 0.1, 0.5]
print(b_df)
b = b_df.values

# observation sequence of dog's behaviors
obs_map = {'sleeping':0, 'eating':1, 'pooping':2}
obs = np.array([1,1,2,1,0,1,2,1,0,2,2,0,1,0,1])
inv_obs_map = dict((v,k) for k, v in obs_map.items())
obs_seq = [inv_obs_map[v] for v in list(obs)]

# define Viterbi algorithm for shortest path
# code adapted from Stephen Marsland's, Machine Learning An Algorthmic Perspective, Vol. 2
# https://github.com/alexsosn/MarslandMLAlgo/blob/master/Ch16/HMM.py
def viterbi(pi, a, b, obs):
    
    print ("\n Viterbi Algorithm")
    # Size of hidden states
    nStates = np.shape(b)[0]
    # Number of Observations
    T = np.shape(obs)[0]

    # init blank path of size of no of Observations
    path = np.zeros(T)
    # delta --> highest probability of any path that reaches state i
    # states x observations
    delta = np.zeros((nStates, T))
    # phi --> argmax by time step for each state
    # states x observations
    phi = np.zeros((nStates, T))
    
    # init delta and phi 
    delta[:, 0] = pi * b[:, obs[0]]
    phi[:, 0] = 0

    print('\nStart Walk Forward\n')    
    # the forward algorithm extension
    for t in range(1, T):
        for s in range(nStates):
            deltaTrans = delta[:, t-1] * a[:, s]
            delta[s, t] = np.max(deltaTrans) * b[s, obs[t]] 
            phi[s, t] = np.argmax(deltaTrans)
    
    # find optimal path
    print('\nStart Backtrace\n')
    path[T-1] = np.argmax(delta[:, T-1])
    for t in range(T-2, -1, -1):
        path[t] = phi[int(path[t+1]), [t+1]]
        
    return path, delta, phi

path, delta, phi = viterbi(pi, a, b, obs)
print('\nsingle best state path: \n')
print (path)

state_map = {0:'healthy', 1:'sick'}
state_path = [state_map[v] for v in path]

output = (pd.DataFrame()
 .assign(Observation=obs_seq)
 .assign(Best_Path=state_path))
print (output)