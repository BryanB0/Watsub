// src/controller/user.js
import mysql from "mysql";
import { Users } from "../model/user.js";
import bcrypt from "bcrypt";
import { connexion } from "../connexion.js";
//import { sendVerificationEmail } from "../../nodemailer.js"; // Importer la fonction pour envoyer l'email

// Définir une constante pour le nombre de hachages
//const HASH_SALT_ROUNDS = 10;

export class UserController {
async getAllUsers() {
    try {
      // Définition de la requête SQL pour sélectionner tout les enregistrements dans la table 'utilisateur'.
      const query = "SELECT * FROM utilisateur";

      // Exécution de la requête SQL et attente des résultats
      let results = await connexion.executeQuery(query);

      // Mapping des résultats de la requête à des objets de la classe Users.
      const users = results.map(
        (result) =>
          new Users(
            result.nom,
            result.prenom,
            result.telephone,
            result.salaire,
            result.mail,
            result.motdepasse,
            result.ismailverif ? result.ismailverif[0] != 0 : false // Ajout d'une vérification ici
          )
      );

      // Retourne la liste d'utilisateurs
      return users;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la récupération des utilisateurs."
      );
    }
  }

  async validatePassword(password) {
    // Vérifier la longueur minimale
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // Vérifier la présence d'au moins une majuscule
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter.");
    }

    // Vérifier la présence d'au moins une minuscule
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter.");
    }

    // Vérifier la présence d'au moins un chiffre
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one digit.");
    }

    // Vérifier la présence d'au moins un caractère spécial
    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error("Password must contain at least one special character.");
    }
  }
  catch(error) {
    console.error("Validation du mot de passe échouée:", error.message);
    throw new Error("La validation du mot de passe a échoué.");
  }

  async validateEmail(email) {
    // Vérifier que l'email contient un arrobase
    if (!email.includes("@")) {
      throw new Error("Email must contain an @ symbol.");
    }

    // Vérifier que l'email contient un point après l'arrobase
    const parts = email.split("@");
    if (parts[1].indexOf(".") === -1) {
      throw new Error("Email must contain a dot (.) after the @ symbol.");
    }
  }
  catch(error) {
    console.error("Validation de l'email échouée:", error.message);
    throw new Error("La validation de l'email a échoué.");
  }
async insertUser(
  prenom,
  nom,
    telephone,
    mail,
    salaire,
    motdepasse,
    ismailverif
  ) {
    try {
      console.log("Paramètres reçus:", {
        prenom,
        nom,
        telephone,
        mail,
        salaire,
        motdepasse,
        ismailverif,
      });

      // Vérifier si un utilisateur avec le même email existe déjà
      const existingEmail = await connexion.executeQuery(
        "SELECT 1 FROM utilisateur WHERE mail = ? LIMIT 1",
        [mail]
      );

      if (existingEmail.length > 0) {
        throw new Error("An account with this email already exists.");
      }

      await connexion.validateEmail(mail);
      await connexion.validatePassword(motdepasse);

      // const hashedPassword = await bcrypt.hash(motdepasse, HASH_SALT_ROUNDS);
      // console.log("Mot de passe haché:", hashedPassword);

      // Remplacer null par false pour ismailverif
      if (ismailverif === null) {
        throw new Error("Il est impossible que ismailverif soit null.");
      }
      // Définition de la requête SQL pour insérer un nouvel utilisateur
      const query = `
      INSERT INTO utilisateur (prenom, nom, telephone, mail, salaire, motdepasse, ismailverif)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      console.log("Requête SQL:", query);
      console.log("Valeurs:", [
        nom,
        prenom,
        telephone,
        salaire,
        mail,
        motdepasse,
        ismailverif ? "1" : "0",
      ]);

      await connexion.executeQuery(query, [
        nom,
        prenom,
        telephone,
        salaire,
        mail,
        motdepasse,
        ismailverif ? "1" : "0",
      ]);

      // Envoyer un email de vérification après l'insertion réussie
      // await sendVerificationEmail(mail);
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de l'insertion d'un utilisateur."
      );
    }
  }

  async deleteUser(mail) {
    try {
      // Vérifier d'abord si l'abonnement existe
      const existingUtilisateur = await connexion.executeQuery(
        "SELECT 1 FROM utilisateur WHERE mail = ?",
        [mail]
      );

      // Si aucun enregistrement n'est retourné, on lance une erreur
      if (existingUtilisateur.length === 0) {
        throw new Error("Aucun Utilisateur avec ce mail n'existe.");
      }

      await connexion.validateEmail(mail);

      const query = "DELETE FROM utilisateur WHERE mail = ?";

      const result = await connexion.executeQuery(query, [mail]);

      // Vérification si la suppression a affecté des lignes
      if (result.affectedRows > 0) {
        return true; // La catégorie a été supprimée avec succès
      } else {
        return false; // La suppression a échoué
      }
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la suppression d'un utilisateur."
      );
    }
  }
async updateUser(
    current_mail,
    nom,
    prenom,
    telephone,
    salaire,
    mail,
    motdepasse,
    ismailverif
  ) {
    try {
      // Vérification que le mail et le mot de passe sont fournis
      if (!mail || !motdepasse) {
        throw new Error("Email and password are required");
      }

      // condition pour vérifier que current_mail et mail ne sont pas identiques
      if (current_mail === mail) {
        throw new Error(
          "Le mail actuel et le nouveau mail ne peuvent pas être identiques."
        );
      }

      // Validation de l'email
      await connexion.validateEmail(mail);

      // Validation du mot de passe
      await connexion.validatePassword(motdepasse);

      const existingUtilisateur = await connexion.executeQuery(
        "SELECT 1 FROM utilisateur WHERE mail = ?",
        [current_mail]
      );

      if (existingUtilisateur.length === 0) {
        throw new Error("Aucun utilisateur avec cet email actuel n'existe.");
      }

      const existingNewMailUtilisateur = await connexion.executeQuery(
        "SELECT 1 FROM utilisateur WHERE mail = ?",
        [mail]
      );

      if (existingNewMailUtilisateur.length > 0 && mail !== current_mail) {
        throw new Error("Cet email existe déjà.");
      }

      let updatedFields = [];
      let updatedValues = [];

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (nom !== undefined) {
        updatedFields.push("nom = ?");
        updatedValues.push(nom);
      }
      if (prenom !== undefined) {
        updatedFields.push("prenom = ?");
        updatedValues.push(prenom);
      }
      if (telephone !== undefined) {
        updatedFields.push("telephone = ?");
        updatedValues.push(telephone);
      }
      if (salaire !== undefined) {
        updatedFields.push("salaire = ?");
        updatedValues.push(salaire);
      }
      if (mail !== undefined) {
        updatedFields.push("mail = ?");
        updatedValues.push(mail);
      }

      if (motdepasse !== undefined) {
        // console.log("Hachage du mot de passe");
        // const hashedPassword = await bcrypt.hash(motdepasse, HASH_SALT_ROUNDS);
        updatedFields.push("motdepasse = ?");
        updatedValues.push(motdepasse);
      }

      if (ismailverif !== undefined) {
        if (ismailverif === true) {
          updatedFields.push("ismailverif = ?");
          updatedValues.push(1);
        } else {
          throw new Error(
            "La vérification de l'email doit être vraie pour modifier l'utilisateur."
          );
        }
      }

      updatedValues.push(current_mail);

      const query = `
         UPDATE utilisateur
         SET ${updatedFields.join(", ")}
         WHERE mail = ?
       `;

      const result = await connexion.executeQuery(query, updatedValues);

      // Si l'email a été mis à jour, envoyer un email de vérification
      // if (mail !== current_mail) {
      //   await sendVerificationEmail(mail);
      // }

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erreur dans updateUser:", error); // Afficher l'objet d'erreur complet
      throw new Error(
        "Une erreur s'est produite lors de la modification d'un utilisateur: " +
          error.message
      );
    }
  }

  async getUserByMail(mail) {
    try {
      const query = `SELECT nom, prenom, telephone, salaire, mail, motdepasse, ismailverif = 1 AS ismailverif FROM utilisateur WHERE mail = ?`;
      let results = await connexion.executeQuery(query, [mail]);

      if (results.length === 0) {
        throw new Error(
          "Aucun utilisateur avec cet email et ce mot de passe n'a été trouvé."
        );
      }

      let user = results[0];
      user.ismailverif = user.ismailverif === 1;

      console.log(user);
      return user;
    } catch (error) {
      console.error("Erreur dans getUserByMailPassword:", error.message);
      throw new Error(
        "Une erreur s'est produite lors de la récupération d'un utilisateur par l'email et le mot de passe: " +
          error.message
      );
    }
  }

  
async getUserByMailPassword(mail, motdepasse) {
    try {
      const query = `SELECT nom, prenom, telephone, salaire, mail, motdepasse, ismailverif = 1 AS ismailverif FROM utilisateur WHERE mail = ? AND motdepasse = ?`;
      let results = await connexion.executeQuery(query, [mail, motdepasse]);

      if (results.length === 0) {
        throw new Error(
          "Aucun utilisateur avec cet email et ce mot de passe n'a été trouvé."
        );
      }

      let user = results[0];
      user.ismailverif = user.ismailverif === 1;

      console.log(user);
      return user;
    } catch (error) {
      console.error("Erreur dans getUserByMailPassword:", error.message);
      throw new Error(
        "Une erreur s'est produite lors de la récupération d'un utilisateur par l'email et le mot de passe: " +
          error.message
      );
    }
  }

  // Middleware pour vérifier si l'utilisateur est connecté
  async isAuthenticated(req, res, next) {
    if (req.session.mail) {
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Vous devez être connecté pour accéder à cette ressource.",
      });
    }
  }

}

// Export de l'instance unique du contrôleur, permettant l'accès aux fonctionnalités définies dans la classe Controller.
export let controller = new UserController();
