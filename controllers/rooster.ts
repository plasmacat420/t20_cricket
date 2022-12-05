import { mysqlConnection } from "../connection";

async function seeRooster(req: any, res: any) {
  await mysqlConnection.query(
    "SELECT * from cricket",
    (err: any, rows: any, field: any) => {
      if (!err) {
        res.status(200).json({ rows: rows });
        console.log("READ file successfully....");
      } else {
        console.log(err);
      }
    }
  );
}

function seeRooster_name(req: any, res: any) {
  mysqlConnection.query(
    "SELECT * from cricket WHERE Player LIKE ?",
    [`%${req.params.id}%`],
    (err: any, rows: any, field: any) => {
      if (!err) {
        res.status(200).json({ rows: rows });
        console.log("  successful ....");
      } else {
        console.log(err);
      }
    }
  );
}

function seeRooster_cred(req: any, res: any) {
  console.log(req.params.id);
  let number = req.params.id;
  mysqlConnection.query(
    "SELECT * from cricket WHERE credRequired = ?",
    [req.params.id],
    (err: any, rows: any, field: any) => {
      if (!err) {
        res.status(200).json({ rows: rows });
        console.log("credRequired sent...");
      } else {
        console.log(err);
      }
    }
  );
}

async function seeRooster_power(req: any, res: any) {
  await mysqlConnection.query(
    "SELECT * from cricket WHERE power = ?",
    [req.params.id],
    (err: any, rows: any, field: any) => {
      if (!err) {
        res.status(200).json({ rows: rows });
        console.log("  successful ....");
      } else {
        console.log(err);
      }
    }
  );
}

async function createTeam(req: any, res: any) {
  const player_id: any = req.body.player_id;
  const team: any = req.body.team;
  let cred = await getCred(team);
  let length = await getLength(team);
  let message: string = "";
 console.log(cred, length)
  if (Number(cred) < 100 && Number(length) < 10) {
    mysqlConnection.query(
      "SELECT * from cricket WHERE ID = ?",
      [player_id],
      (err: any, rows: any, fields: any) => {
        if (!err) {
          console.log("cred", Number(rows[0].credRequired));
          console.log("total cred", Number(cred));
          console.log(
            "player cred + total cred",
            Number(rows[0].credRequired) + Number(cred)
          );
          if (Number(rows[0].credRequired) + Number(cred) <= 100) {
            mysqlConnection.query(
              "INSERT INTO team (ID, Player, credRequired, power, team) VALUES (?)",
              [
                [
                  rows[0].ID,
                  rows[0].Player,
                  rows[0].credRequired,
                  rows[0].power,
                  team,
                ],
              ],
              (err: any, rows: any, fields: any) => {
                if (!err) {
                  console.log("Player Sucessfully added in team ", team);
                  res.send({ message: "successfully added" });
                } else {
                  console.log(err);
                  res.send({ message: err });
                }
              }
            );
          } else {
            message += `total cred should be less than 100! you have used ${Number(
              cred
            )} creds. Please add a Player with credRequired= ${
              100 - Number(cred)
            }`;
            res.send({ message: message });
          }
        } else {
          console.log(err);
          res.status(400).send({ error: err });
        }
      }
    );
  } else {
    if (Number(cred) >= 100) {
      message += `Make the team only using 100 creds! Your cred used ${Number(cred)} `;
    } else {
      if (Number(length) >= 10) {
        message += `Only 10 players allowed to play! Your players in the team are ${Number(length)}`;
      } else {
        message += `this is nothing`;
      }
    }
    res.send({ message: message });
  }
}

async function playGame(req: any, res: any) {
  let power_1 = await getPower(1);
  let power_2 = await getPower(2);
  console.log({ team_1_power: power_1, team_2_power: power_2 });

  let cred_1 = await getCred(1);
  let cred_2 = await getCred(2);
  console.log({ team_1_cred: cred_1, team_2_cred: cred_2 });

  let length_1 = await getLength(1);
  let length_2 = await getLength(2);
  console.log({ team_1_length: length_1, team_2_length: length_2 });

  // res.send({ team_1: power_1, team_2: power_2 });
  if (length_1 == 10 && length_2 == 10) {
    if (Number(power_1) > Number(power_2)) {
      console.log({
        
        "Winning team": "TEAM_1",
        Team_1_power: power_1,
        Team_2_power: power_2,
      })
      res.send({
        
        "Winning team": "TEAM_1",
        Team_1_power: power_1,
        Team_2_power: power_2,
      });
    } else {
      if (Number(power_2) > Number(power_1)) {
        console.log({
          "Winning team": "TEAM_2",
          Team_1_power: power_1,
          Team_2_power: power_2,
        })
        res.send({
          "Winning team": "TEAM_2",
          Team_1_power: power_1,
          Team_2_power: power_2,
        });
      } else {
        console.log({
          "Winning team": "ITS A TIE",
          Team_1_power: power_1,
          Team_2_power: power_2,
        })
        res.send({
          "Winning team": "ITS A TIE",
          Team_1_power: power_1,
          Team_2_power: power_2,
        });
      }
    }
  } else {
    res.send({ message: "INVALID NUMBER OF PLAYERS IN THE TEAM" });
  }
}

function getPower(teamNumber: number) {
  return new Promise((resolve, reject) => {
    let power: number = 0;

    mysqlConnection.query(
      "SELECT power from team WHERE team = ?",
      [teamNumber],
      (err: any, rows: any, field: any) => {
        if (!err) {
          // res.send({ rows: rows });

          for (let i = 0; i < rows.length; i++) {
            power += Number(rows[i].power);
          }
          // console.log(teamNumber, power);

          resolve(power);
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
}

function getLength(teamNumber: number) {
  return new Promise((resolve, reject) => {
    let length: number = 0;

    mysqlConnection.query(
      "SELECT * from team WHERE team = ?",
      [teamNumber],
      (err: any, rows: any, field: any) => {
        if (!err) {
          // res.send({ rows: rows });

          for (let i = 0; i < rows.length; i++) {
            length += 1;
          }
          // console.log(teamNumber, power);

          resolve(length);
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
}

function getCred(teamNumber: number) {
  return new Promise((resolve, reject) => {
    let cred: number = 0;

    mysqlConnection.query(
      "SELECT credRequired from team WHERE team = ?",
      [teamNumber],
      (err: any, rows: any, field: any) => {
        if (!err) {
          // res.send({ rows: rows });

          for (let i = 0; i < rows.length; i++) {
            cred += Number(rows[i].credRequired);
          }
          // console.log(teamNumber, power);

          resolve(cred);
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
}

function demo (){
  console.log("INSDIDE DEMO")
  return true
}

function demo2 (){
  console.log("INSDIDE DEMO")
  return true
}

export {
  seeRooster,
  seeRooster_cred,
  seeRooster_name,
  seeRooster_power,
  createTeam,
  playGame,
};
