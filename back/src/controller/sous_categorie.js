import { SousCategorie } from "../model/sous_categorie.js";
import { connexion } from "../connexion.js"; // Assurez-vous que le chemin est correct

export class SousCategorieController {
  async getAllSousCategorie() {
    try {
      // Définition de la requête SQL pour sélectionner tout les enregistrements dans la table 'categorie'.
      const query = "SELECT * FROM sous_categorie";

      // Exécution de la requête SQL et attente des résultats
      let results = await connexion.executeQuery(query);

      // Mapping des résultats de la requête à des objets de la classe categorie.
      const sous_categories = results.map(
        (result) =>
          new SousCategorie(
            result.Id_sous_categorie,
            result.nom_sous_categorie,
            result.couleur_sous_categorie
          )
      );

      // Retourne la liste des categories
      return sous_categories;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la récupération des categories."
      );
    }
  }

  async insertSousCategorie(nom_sous_categorie, couleur_sous_categorie) {
    try {
      const existingSousCategorie = await connexion.executeQuery(
        "SELECT 1 FROM sous_categorie WHERE nom_sous_categorie = ? LIMIT 1",
        [nom_sous_categorie]
      );

      if (existingSousCategorie.length > 0) {
        throw new Error("la nom de la sous categorie existe déjà.");
      }
      // Définition de la requête SQL pour insérer une nouvelle categorie
      const query = `
      INSERT INTO sous_categorie (
        nom_sous_categorie,
        couleur_sous_categorie
      )
      VALUES (?, ?)
    `;

      // Exécution de la requête
      await connexion.executeQuery(query, [
        nom_sous_categorie,
        couleur_sous_categorie,
      ]);
    } catch (error) {
      // Renvoyer une nouvelle erreur avec le message personnalisé
      throw new Error(
        "Erreur lors de l'insertion de la sous categorie : " + error.message
      );
    }
  }

  async deleteSousCategorie(nom_sous_categorie) {
    try {
      // Vérifier d'abord si la categorie existe
      const existingSousCategorie = await connexion.executeQuery(
        "SELECT 1 FROM sous_categorie WHERE nom_sous_categorie = ?",
        [nom_sous_categorie]
      );

      // Si aucun enregistrement n'est retourné, on lance une erreur
      if (existingSousCategorie.length === 0) {
        throw new Error("Aucun sous categorie avec ce nom n'existe.");
      }

      // S'il existe, on procède à la suppression
      const query = "DELETE FROM sous_categorie WHERE nom_sous_categorie = ?";
      const result = await connexion.executeQuery(query, [nom_sous_categorie]);

      // Vérification si la suppression a affecté des lignes
      if (result.affectedRows > 0) {
        return true; // La catégorie a été supprimée avec succès
      } else {
        return false; // La suppression a échoué
      }
    } catch (error) {
      console.error("Database operation failed:", error);
      throw new Error(
        "Erreur lors de la suppression de la categorie : " + error.message
      );
    }
  }
// Méthode asynchrone pour mettre à jour les informations d'une categorie
  async updateSousCategorie(
    current_nom_sous_categorie,
    nom_sous_categorie,
    couleur_sous_categorie
  ) {
    try {
      // Validation des entrées.
      if (!nom_sous_categorie && !couleur_sous_categorie) {
        throw new Error(
          "Au moins un des paramètres doit être fourni (nom_sous_categorie, couleur_sous_categorie)."
        );
      }

      // Condition pour vérifier que current_nom et nom ne sont pas identiques
      if (current_nom_sous_categorie === nom_sous_categorie) {
        throw new Error(
          "Le nom actuel et le nouveau nom ne peuvent pas être identiques."
        );
      }

      // Vérifier si le current_nom existe
      if (nom_sous_categorie) {
        const existingSousCategorie = await connexion.executeQuery(
          "SELECT 1 FROM sous_categorie WHERE nom_sous_categorie = ?",
          [current_nom_sous_categorie]
        );

        if (existingSousCategorie.length === 0) {
          throw new Error("Aucune sous catégorie avec ce nom actuel n'existe.");
        }
      }

      // Vérifier si le nouveau nom est unique
      if (nom_sous_categorie) {
        const existingNewNomSousCategorie = await connexion.executeQuery(
          "SELECT 1 FROM sous_categorie WHERE nom_sous_categorie = ?",
          [nom_sous_categorie]
        );

        if (existingNewNomSousCategorie.length > 0) {
          throw new Error("Ce nom sous categorie existe deja");
        }
      }

      // Initialisation des champs et valeurs mise à jour
      let updatedFields = [];
      let updatedValues = [];

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (nom_sous_categorie !== undefined) {
        updatedFields.push("nom_sous_categorie = ?");
        updatedValues.push(nom_sous_categorie);
      }

      if (couleur_sous_categorie !== undefined) {
        updatedFields.push("couleur_sous_categorie = ?");
        updatedValues.push(couleur_sous_categorie);
      }

      // Ajout de current_nom_sous_categorie pour la condition WHERE
      updatedValues.push(current_nom_sous_categorie);

      // Construction de la requête SQL
      const query = `
        UPDATE sous_categorie
        SET ${updatedFields.join(", ")}
        WHERE nom_sous_categorie = ?
      `;

      // Exécution de la requête de mise à jour dans la base de données
      const result = await connexion.executeQuery(query, updatedValues);

      // Vérification si la mise à jour a affecté des lignes
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la mise à jour de la catégorie",
        error
      );
      throw new Error(
        "Une erreur est survenue lors de la mise à jour de la catégorie."
      );
    }
  }

  // Méthode asynchrone pour récupérer un utilisateur en fonction du nom de la categorie
  async getSousCategorieByNom(nom_sous_categorie) {
    try {
      const query = `SELECT * FROM sous_categorie WHERE nom_sous_categorie = ?`;

      // Exécution de la requête SQL et attente des résultats.
      let result = await connexion.executeQuery(query, [nom_sous_categorie]);

      // Vérification si la catérgoie a été trouvée
      if (result.length === 0) {
        throw new Error("Aucune catégorie avec ce nom n'a été trouvée.");
      }
      // Retour la catégorie trouvée
      return result[0];
    } catch (error) {
      // En cas d'erreur, lance une exception pour gérer l'erreur à un niveau supérieur
      throw new Error(
        "Une erreur s'est produite lors de la récupération de la categorie par son nom." +
          error.message
      );
    }
  }
}

// Export de l'instance unique du contrôleur, permettant l'accès aux fonctionnalités définies dans la classe Controller.
export let controller = new SousCategorieController();
    