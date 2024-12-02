# 🎲 GPS Tombola - Because Regular Bingo Wasn't Italian Enough! 🎄

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Pasta Level](https://img.shields.io/badge/pasta%20level-al%20dente-orange)]()

## 🎯 What's This All About?

Welcome to GPS Tombola - the digital version of the traditional Italian Christmas game that's more fun than trying to convince your nonna that pineapple doesn't belong on pizza! 

This isn't just any Tombola - it's a modern, cloud-native Tombola that runs on OpenShift. Because nothing says "Buon Natale" like containerized gaming! 🎅

## ✨ Features

- 🎮 Real-time multiplayer - Watch grandpa try to figure out how to unmute himself!
- 🎁 Multiple game variants - Because one way to play isn't Italian enough
- 🏆 Customizable prizes - From panettone to prosecco (digital ones, sorry!)
- 👮‍♂️ Admin controls - Someone has to be the boss (just like mamma)
- 📱 Responsive design - Play on any device, even on that ancient tablet from 2010

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + PatternFly 6 (because we're fancy)
- **Backend**: Node.js + Express + PostgreSQL (the holy trinity)
- **State Management**: Zustand (because Redux is too 2020)
- **Deployment**: OpenShift + Helm (because we're enterprise-y)

## 🚀 Quick Start

Want to deploy faster than your uncle devours Christmas dinner? Here you go:

```bash
# Add our super-fancy Helm repo
helm repo add bingo https://github.com/redhat-gss/bingo-helm
helm repo update
# Deploy it like it's hot!
helm install bingo-chart bingo/bingo
```
## 🏗 Architecture

```ascii
+---------------+ +---------------+ +---------------+
|               | |               | |               |
|   Frontend    -->   Backend     --> | Database    |
|  (React.js)   | |  (Node.js)    | |  (PostgreSQL) |
|               | |               | |               |
+---------------+ +---------------+ +---------------+
^                                                   ^
|                                                   |
+--------------- "Where's my number?" ------------->+
```

## 👥 The Dream Team

Created with ❤️ (and lots of caffè) by Me. We're the folks who thought: "Hey, let's modernize a centuries-old game because... why not?"

## 🤝 Contributing

Found a bug? Want to add a feature? Know how to make the animations more pizzazz-y? We're all ears! Just:

1. Fork it
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
6. Wait for our code review (while enjoying a cannoli)

## 📜 License

This project is licensed under the GNU GPL3 License - because sharing is caring, just like nonna's recipes!

## 🙏 Special Thanks

- To whoever invented coffee
- To our families for understanding our "just one more commit" moments
- To Stack Overflow (our true MVP)
- To that one developer who fixed that crucial bug at 3 AM (Me)

---

Made with 🍕 in Italy

*Remember: In case of emergency, try turning it off and on again, or call your Italian grandmother.*