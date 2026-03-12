import matplotlib.pyplot as plt
import numpy as np

# n values
n = np.array([5, 6, 10, 11, 15, 16, 20, 21, 25, 26, 60, 120])

# Loop factorial timings (ns) — FIRST dataset
time_loop = np.array([
    14.393, 17.385, 33.771, 37.57, 47.922, 47.436,
    79.089, 74.153, 75.817, 93.296, 169.089, 311.766
])

# Recursive factorial timings (ns) — SECOND dataset
time_rec = np.array([
    19.051, 22.732, 39.966, 42.132, 57.200, 58.184,
    84.534, 86.075, 101.931, 114.210, 252.786, 503.371
])

plt.figure(figsize=(9, 5))

plt.plot(n, time_loop, marker='o', linewidth=1.5, label="Loop factorial")
plt.plot(n, time_rec, marker='s', linewidth=1.5, label="Recursive factorial")

# Clean x-axis
plt.xticks([5, 10, 20, 25, 60, 120])

plt.xlabel("Value of n")
plt.ylabel("Time taken (ns)")
plt.title("Factorial: Loop vs Recursion (Execution Time)")
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()

plt.tight_layout()
plt.show()
