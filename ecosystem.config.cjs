// module.exports = {
//   apps: [
//     {
//       name: "next-app",
//       script: "npm",
//       args: "start",
//       cwd: "/app",
//       instances: 1,
//       exec_mode: "fork",
//       env: {
//         NODE_ENV: "production",
//         PORT: 3000,
//         HOSTNAME: "0.0.0.0",
//       },
//     },
//   ],
// };
module.exports = {
  apps: [
    {
      name: "next-app",
      script: "./server.cjs",
      cwd: "/app",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
