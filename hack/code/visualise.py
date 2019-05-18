import matplotlib.pyplot as plt

plt.style.use('fivethirtyeight')

plt.scatter(points['X'][0], points['Y'][0], s=10)
plt.scatter(nodes['X'], nodes['Y'], s=10)