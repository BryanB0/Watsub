// Import du contrôleur qui gère la logique métier de l'application
import { controller } from "../controller/sous_categorie.js";

// Import des modules Express et bodyParser pour la gestion des routes et du corps des requêtes.
import express from "express";
import bodyParser from "body-parser";

// Création d'un routeur Express
export let router = express.Router();

// Configuration du middleware bodyParser pour analyser le corps des requêtes en JSON.
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Route pour récupérer tous les categories.
router.get(
  "/get_all_sous_categorie",
  async (req, res) => {
    try {
      // Appel de la méthode du contrôleur pour récupérer tout les categories
      const results = await controller.getAllSousCategorie();
      res.json(results);
    } catch (error) {
      // En cas d'erreur, loggez l'erreur et envoyez une réponse d'erreur au client.
      console.error("Erreur : " + error.stack);
      res.status(500).send("Erreur lors de la récupération des données.");
    }
  }
);

// Route pour créer un nouvel categorie.
router.post(
  "/create_sous_categorie",
  async (req, res) => {
    try {
      // Extraction des donnés du corps de la requête.
      const { nom_sous_categorie, couleur_sous_categorie } = req.body;

      // Vérification que tous les champs requis sont fournis et valides
      if (!nom_sous_categorie || typeof nom_sous_categorie !== "string") {
        return res.status(400).json({
          success: false,
          message:
            "Le nom de la sou catégorie est requis et doit être une chaîne de caractères.",
        });
      }

      if (
        !couleur_sous_categorie ||
        typeof couleur_sous_categorie !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "La couleur de la sous catégorie est requis et doit être une chaîne de caractères.",
        });
      }

      // Appel de la méthode du contrôleur pour insérer un nouvelle categorie.
      await controller.insertSousCategorie(
        nom_sous_categorie,
        couleur_sous_categorie
      );

      // Réponse réussie si tout se passe bien.
      res
        .status(200)
        .json({ success: true, message: "Categorie créé avec succès." });
    } catch (error) {
      // En cas d'erreur, loggez l'erreur et envoyez une réponse d'erreur au client
      console.error("Erreur : " + error.stack);
      return res
        .status(500)
        .send("Erreur lors de l'insertion de la catégorie.");
    }
  }
);
// Route pour supprimer l'utilisateur
router.delete(
  "/delete_sous_categorie",
  async (req, res) => {
    try {
      // Récupération du paramètre nom du corps de la requête.
      const { nom_sous_categorie } = req.body;

      // Vérification des types des données.
      if (typeof nom_sous_categorie != "string") {
        res.sendStatus(400); // Bad Request
        return;
      }

      // Vérification que le nom est fourni
      if (!nom_sous_categorie) {
        return res.status(400).json({
          success: false,
          message:
            "Le nom de la sous catégorie est requis pour la suppression.",
        });
      }

      // Appel de la méthode du contrôleur pour supprimer la categorie.
      const result = await controller.deleteSousCategorie(nom_sous_categorie);

      // Vérifier si la suppression a réussi
      if (result) {
        return res.status(200).json({
          success: true,
          message: "Sous Categorie supprimé avec succès.",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Sous Categorie non trouvé." });
      }
    } catch (error) {
      // En cas d'erreur, loggez l'erreur et envoyez une réponse d'erreur au client.
      console.log("Erreur : " + error.stack);
      res
        .status(500)
        .send("Erreur lors de la suppression de la sous categorie");
    }
  }
);

// Route pour mettre à jour une catégorie
router.put(
  "/update_sous_categorie",
  async (req, res) => {
    try {
      // Récupérer les données de la requête
      const {
        current_nom_sous_categorie,
        nom_sous_categorie,
        couleur_sous_categorie,
      } = req.body;

      // Vérification des types des données
      if (
        typeof current_nom_sous_categorie !== "string" ||
        (nom_sous_categorie && typeof nom_sous_categorie !== "string") ||
        (couleur_sous_categorie && typeof couleur_sous_categorie !== "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Les types des données sont incorrects.",
        });
      }
      // Vérifier que l'ID de la catégorie est fourni
      if (!current_nom_sous_categorie) {
        return res.status(400).json({
          success: false,
          message:
            "Le current nom de la sous catégorie est requis pour la mise à jour.",
        });
      }

      // Vérification que le nom est fourni
      if (!nom_sous_categorie) {
        return res.status(400).json({
          success: false,
          message:
            "Le nom de la sous catégorie est requis pour la modification.",
        });
      }

      // Vérification que la couleur est fourni
      if (!couleur_sous_categorie) {
        return res.status(400).json({
          success: false,
          message:
            "La couleur de la sous catégorie est requis pour la modification.",
        });
      }

      // Appeler la méthode pour mettre à jour la catégorie
      const souscategorieMiseAJour = await controller.updateSousCategorie(
        current_nom_sous_categorie,
        nom_sous_categorie,
        couleur_sous_categorie
      );

      // Vérifier si la mise à jour a réussi
      if (souscategorieMiseAJour) {
        res.status(200).json({
          success: true,
          message: "Catégorie sous mise à jour avec succès.",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "La catégorie sous n'a pas été mise à jour.",
        });
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la mise à jour de la sous catégorie:",
        error
      );
      res.status(500).json({
        success: false,
        message:
          "Une erreur est survenue lors de la mise à jour de la sous catégorie.",
      });
    }
  }
);
router.get(
  "/get_sous_categorie_by_nom",
  async (req, res) => {
    try {
      const { nom_sous_categorie } = req.body;

      // Vérification des types des données.
      if (typeof nom_sous_categorie !== "string") {
        return res.status(400).json({
          success: false,
          message: "Le type du nom de la sous catégorie est incorrect.",
        });
      }

      // Vérification que le nom est fourni
      if (!nom_sous_categorie) {
        return res.status(400).json({
          success: false,
          message:
            "Le nom de la catégorie est requis pour retourner les valeurs de Categorie.",
        });
      }

      const sous_categorie = await controller.getSousCategorieByNom(
        nom_sous_categorie
      );

      res.json(sous_categorie);
    } catch (error) {
      console.error("Erreur : " + error.stack);
      res
        .status(500)
        .send(
          "Erreur lors de la récupération des données de la sous categorie"
        );
    }
  }
);

export { router as sousCategorieRouter };
