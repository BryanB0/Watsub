// src/controller/user.js
import mysql from "mysql";
import { Abonnement } from "../model/abonnement.js";
import { connexion } from "../connexion.js";

export class AbonnementController {

  async getAllAbonnement() {
    try {
      // Définition de la requête SQL pour sélectionner tout les enregistrements dans la table 'abonnement'.
      const query = "SELECT * FROM abonnement";

      // Exécution de la requête SQL et attente des résultats
      let results = await connexion.executeQuery(query);

      // Mapping des résultats de la requête à des objets de la classe abonnement.
      const abonnements = results.map(
        (result) =>
          new Abonnement(
            result.nom_abonnement,
            result.nom_fournisseur,
            result.montant,
            result.frequence_prelevement,
            result.date_echeance,
            result.date_fin_engagement,
            result.IsEngagement ? result.IsEngagement[0] != 0 : false,
            result.id_categorie
          )
      );

      // Retourne la liste d'un abonnement.
      return abonnements;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la récupération des abonnements."
      );
    }
  }

  async insertAbonnement(
    nom_fournisseur,
    montant,
    frequence_prelevement,
    date_echeance,
    date_fin_engagement,
    IsEngagement,
    nom_categorie,
    couleur_categorie,
    nom_sous_categorie,
    couleur_sous_categorie
  ) {
    try {
      // Vérifier si un abonnement avec le même nom existe déjà
      const existingAbonnement = await connexion.executeQuery(
        "SELECT 1 FROM abonnement WHERE nom_fournisseur = ? LIMIT 1",
        [nom_fournisseur]
      );

      // Si un enregistrement est retourné, cela signifie que le nom_abonnement est déjà pris.
      if (existingAbonnement.length > 0) {
        throw new Error("Un fournisseur avec ce nom existe déjà.");
      }

      const dateEcheanceObj = new Date(date_echeance);
      const dateFinEngagementObj = new Date(date_fin_engagement);

      if (dateEcheanceObj >= dateFinEngagementObj) {
        throw new Error(
          "La date d'échéance doit être antérieure à la date de fin d'engagement."
        );
      }

      // Vérifier si la catégorie existe déjà par nom et couleur, sinon l'ajouter
      const existingCategorieByNameAndColor = await connexion.executeQuery(
        "SELECT id_categorie FROM categorie WHERE nom_categorie = ? AND couleur_categorie = ?",
        [nom_categorie, couleur_categorie]
      );

      let categorieId;
      if (existingCategorieByNameAndColor.length === 0) {
        // La catégorie n'existe pas, nous devons l'insérer
        const insertCategorieQuery =
          "INSERT INTO categorie (nom_categorie, couleur_categorie) VALUES (?, ?)";
        const insertCategorieResult = await connexion.executeQuery(
          insertCategorieQuery,
          [nom_categorie, couleur_categorie]
        );
        categorieId = insertCategorieResult.insertId;
      } else {
        // La catégorie existe, nous récupérons son id
        categorieId = existingCategorieByNameAndColor[0].id_categorie;
      }

      let SousCategorieId;
      // Vérifier si la catégorie existe déjà par nom et couleur, sinon l'ajouter
      const existingSousCategorieByNameAndColor = await connexion.executeQuery(
        "SELECT id_sous_categorie FROM sous_categorie WHERE nom_sous_categorie = ? AND couleur_sous_categorie = ?",
        [nom_sous_categorie, couleur_sous_categorie]
      );

      if (existingSousCategorieByNameAndColor.length === 0) {
        // La catégorie n'existe pas, nous devons l'insérer
        const insertSousCategorieQuery =
          "INSERT INTO sous_categorie (nom_sous_categorie, couleur_sous_categorie) VALUES (?, ?)";
        const insertSousCategorieResult = await connexion.executeQuery(
          insertSousCategorieQuery,
          [nom_sous_categorie, couleur_sous_categorie]
        );
        SousCategorieId = insertSousCategorieResult.insertId;
      } else {
        // La catégorie existe, nous récupérons son id
        SousCategorieId =
          existingSousCategorieByNameAndColor[0].id_sous_categorie;
      }
      // Définition de la requête SQL pour insérer un nouvel abonnement
      const query = `
        INSERT INTO abonnement (
          nom_fournisseur,
          montant,
          frequence_prelevement,
          date_echeance,
          date_fin_engagement,
          IsEngagement,
          id_Categorie,
          id_sous_categorie
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

      // Exécution de la requête
      await connexion.executeQuery(query, [
        nom_fournisseur,
        montant,
        frequence_prelevement,
        date_echeance,
        date_fin_engagement,
        IsEngagement ? "1" : "0",
        categorieId,
        SousCategorieId,
      ]);
    } catch (error) {
      // Renvoyer une nouvelle erreur avec le message personnalisé
      throw new Error(
        "Erreur lors de l'insertion de l'abonnement : " + error.message
      );
    }
  }

  async deleteAbonnement(nom_abonnement) {
    try {
      // Vérifier d'abord si l'abonnement existe
      const existingAbonnement = await connexion.executeQuery(
        "SELECT 1 FROM abonnement WHERE nom_abonnement = ?",
        [nom_abonnement]
      );

      // Si aucun enregistrement n'est retourné, on lance une erreur
      if (existingAbonnement.length === 0) {
        throw new Error("Aucun abonnement avec ce nom n'existe.");
      }

      // S'il existe, on procède à la suppression
      const query = "DELETE FROM abonnement WHERE nom_abonnement = ?";
      const result = await connexion.executeQuery(query, [nom_abonnement]);

      // Vérification si la suppression a affecté des lignes
      if (result.affectedRows > 0) {
        return true; // La catégorie a été supprimée avec succès
      } else {
        return false; // La suppression a échoué
      }
    } catch (error) {
      console.error("Database operation failed:", error);
      throw new Error("Erreur lors de la suppression de l'abonnement.");
    }
  }

  // Méthode asynchrone pour mettre à jour les informations d'un abonnement dans la base de données.
  async updateAbonnement(
    current_nom_abonnement, // Utilisez 'current_nom_abonnement' pour identifier l'utilisateur actuel
    nom_abonnement,
    nom_fournisseur,
    montant,
    frequence_prelevement,
    date_echeance,
    date_fin_engagement,
    IsEngagement,
    id_categorie
  ) {
    try {
      // Validation des entrées.
      if (
        !nom_abonnement &&
        !nom_fournisseur &&
        !montant &&
        !frequence_prelevement &&
        !date_echeance &&
        !date_fin_engagement &&
        !IsEngagement &&
        !id_categorie
      ) {
        throw new Error("Au moins un des paramètres doit être fourni.");
      }

      // Vérifier si le current_nom existe
      const existingAbonnement = await connexion.executeQuery(
        "SELECT 1 FROM abonnement WHERE nom_abonnement = ?",
        [current_nom_abonnement]
      );

      if (existingAbonnement.length === 0) {
        throw new Error("Aucune abonnement avec ce nom actuel n'existe pas.");
      }

      // Vérifier si le nouveau nom est unique
      const existingNewNomAbonnement = await connexion.executeQuery(
        "SELECT 1 FROM abonnement WHERE nom_abonnement = ?",
        [nom_abonnement]
      );

      if (existingNewNomAbonnement.length > 0) {
        throw new Error("Ce nom abonnement existe deja");
      }

      if (date_echeance && date_fin_engagement) {
        const dateEcheanceObj = new Date(date_echeance);
        const dateFinEngagementObj = new Date(date_fin_engagement);

        if (dateEcheanceObj >= dateFinEngagementObj) {
          throw new Error(
            "La date d'échéance doit être antérieure à la date de fin d'engagement."
          );
        }
      }

      // Initialisation des champs et valeurs mise à jour
      let updatedFields = [];
      let updatedValues = [];

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (nom_abonnement) {
        updatedFields.push("nom_abonnement = ?");
        updatedValues.push(nom_abonnement);
      }

      if (nom_fournisseur) {
        updatedFields.push("nom_fournisseur = ?");
        updatedValues.push(nom_fournisseur);
      }

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (montant) {
        updatedFields.push("montant = ?");
        updatedValues.push(montant);
      }

      if (frequence_prelevement) {
        updatedFields.push("frequence_prelevement = ?");
        updatedValues.push(frequence_prelevement);
      }

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (date_echeance) {
        updatedFields.push("date_echeance = ?");
        updatedValues.push(date_echeance);
      }

      if (date_fin_engagement) {
        updatedFields.push("date_fin_engagement = ?");
        updatedValues.push(date_fin_engagement);
      }

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (typeof IsEngagement === "boolean") {
        updatedFields.push("IsEngagement = ?");
        updatedValues.push(IsEngagement);
      }

      if (id_categorie) {
        updatedFields.push("id_categorie = ?");
        updatedValues.push(id_categorie);
      }

      // Ajout de l'current_nom pour la condition WHERE
      updatedValues.push(current_nom_abonnement);

      // Construction de la requête SQL
      const query = `
         UPDATE abonnement
         SET ${updatedFields.join(", ")}
         WHERE nom_abonnement = ?
       `;

      // Exécution de la requête de mise à jour dans la base de données
      const result = await connexion.executeQuery(query, updatedValues);

      // Vérification si la mise à jour a affecté des lignes
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(
        "Erreur lors de la mise à jour de l'abonnement : " + error.message
      );
    }
  }

  async getAbonnementByNomAbonnement(nom_abonnement) {
    try {
      // Construction de la requête SQL pour sélectionneur tout les champs de la categorie ayant le nom de l'abonnement spécifié.
      const query =
        "SELECT *, IsEngagement FROM abonnement WHERE nom_abonnement = ?";
      // Exécution de la requête SQL et attente des résultats.
      let results = await connexion.executeQuery(query, [nom_abonnement]);

      // Vérification si l'abonnement a été trouvé
      if (results.length === 0) {
        throw new Error("Aucun abonnement avec ce nom n'a été trouvé.");
      }

      // Convertir les résultats en abonnement une boucle forEach
      results.forEach((result) => {
        result.IsEngagement = result.IsEngagement === 1 ? true : false;
      });
      return results[0]; // Retourner un seul abonnement
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la récupération de l'abonnement par son nom."
      );
    }
  }
}

// Export de l'instance unique du contrôleur, permettant l'accès aux fonctionnalités définies dans la classe Controller.
export let controller = new AbonnementController();
