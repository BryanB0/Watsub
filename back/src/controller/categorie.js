import { connexion } from "../connexion.js"; // Assurez-vous que le chemin est correct
import { Categorie } from "../model/categorie.js";

export class CategorieController {
  async getAllCategorie() {
    try {
      // Définition de la requête SQL pour sélectionner tout les enregistrements dans la table 'categorie'.
      const query = "SELECT * FROM categorie";

      // Exécution de la requête SQL et attente des résultats
      let results = await connexion.executeQuery(query);

      // Mapping des résultats de la requête à des objets de la classe categorie.
      const categories = results.map(
        (result) =>
          new Categorie(result.id_Categorie, result.nom_categorie, result.couleur_categorie)
      );

      // Retourne la liste des categories
      return categories;
    } catch (error) {
      throw new Error(
        "Une erreur s'est produite lors de la récupération des categories."
      );
    }
  }
async insertCategorie(nom_categorie, couleur_categorie) {
    try {
      const existingCategorie = await connexion.executeQuery(
        "SELECT 1 FROM categorie WHERE nom_categorie = ? LIMIT 1",
        [nom_categorie]
      );

      if (existingCategorie.length > 0) {
        throw new Error("la nom de la categorie existe déjà.");
      }
      // Définition de la requête SQL pour insérer une nouvelle categorie
      const query = `
      INSERT INTO categorie (
        nom_categorie,
        couleur_categorie
      )
      VALUES (?, ?)
    `;

      // Exécution de la requête
      await connexion.executeQuery(query, [nom_categorie, couleur_categorie]);
    } catch (error) {
      // Renvoyer une nouvelle erreur avec le message personnalisé
      throw new Error(
        "Erreur lors de l'insertion de la categorie : " + error.message
      );
    }
  }
async deleteCategorie(nom_categorie) {
    try {
      // Vérifier d'abord si la categorie existe
      const existingCategorie = await connexion.executeQuery(
        "SELECT 1 FROM categorie WHERE nom_categorie = ?",
        [nom_categorie]
      );

      // Si aucun enregistrement n'est retourné, on lance une erreur
      if (existingCategorie.length === 0) {
        throw new Error("Aucun sous categorie avec ce nom n'existe.");
      }

      // S'il existe, on procède à la suppression
      const query = "DELETE FROM categorie WHERE nom_categorie = ?";
      const result = await connexion.executeQuery(query, [nom_categorie]);

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
  async updateCategorie(
    current_nom_categorie,
    nom_categorie,
    couleur_categorie
  ) {
    try {
      // Validation des entrées.
      if (!nom_categorie && !couleur_categorie) {
        throw new Error(
          "Au moins un des paramètres doit être fourni (nom_categorie, couleur_categorie)."
        );
      }

      // Condition pour vérifier que current_nom et nom ne sont pas identiques
      if (current_nom_categorie === nom_categorie) {
        throw new Error(
          "Le nom actuel et le nouveau nom_categorie ne peuvent pas être identiques."
        );
      }

      // Vérifier si le current_nom existe
      if (nom_categorie) {
        const existingCategorie = await connexion.executeQuery(
          "SELECT 1 FROM categorie WHERE nom_categorie = ?",
          [current_nom_categorie]
        );

        if (existingCategorie.length === 0) {
          throw new Error("Aucune catégorie avec ce nom actuel n'existe.");
        }
      }

      // Vérifier si le nouveau nom est unique
      if (nom_categorie) {
        const existingNewNomCategorie = await connexion.executeQuery(
          "SELECT 1 FROM categorie WHERE nom_categorie = ?",
          [nom_categorie]
        );

        if (existingNewNomCategorie.length > 0) {
          throw new Error("Ce nom existe deja");
        }
      }

      // Initialisation des champs et valeurs mise à jour
      let updatedFields = [];
      let updatedValues = [];

      // Mise à jour des champs et valeurs en fonction des paramètres fournis
      if (nom_categorie !== undefined) {
        updatedFields.push("nom_categorie = ?");
        updatedValues.push(nom_categorie);
      }

      if (couleur_categorie !== undefined) {
        updatedFields.push("couleur_categorie = ?");
        updatedValues.push(couleur_categorie);
      }

      // Ajout de l'current_nom pour la condition WHERE
      updatedValues.push(current_nom_categorie);

      // Construction de la requête SQL
      const query = `
        UPDATE categorie
        SET ${updatedFields.join(", ")}
        WHERE nom_categorie = ?
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
  async getCategorieByNom(nom_categorie) {
    try {
      const query = `SELECT * FROM categorie WHERE nom_categorie = ?`;

      // Exécution de la requête SQL et attente des résultats.
      let result = await connexion.executeQuery(query, [nom_categorie]);

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
export let controller = new CategorieController();
