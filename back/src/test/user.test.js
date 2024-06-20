/*import supertest from 'supertest';
import app from '../src/app';
import database from '../connexion';

describe.only('Users', () => {

    beforeAll(async () => {
        // INIT
        await database.initialize();
    });

   it('Create User 1', async () => {
        const users = await supertest(app).post('/user/create_user"')
        .send({nom: 'Bosse', prenom: 'Bryan', telephone: '0677010203', salaire: 2000, mail: 'bosseb6@gm.fr', motdepasse: 'Meilleur mot de passe'})
        expect(users.statusCode).toBe(201);
    });

    it('should edit user', async () => {
        const users = await supertest(app).put('/users/get_user_by_mail?mail=bosseb6@gm.fr')
        .send({nom: 'Bosse', prenom: 'Bryan', telephone: '0715691212', salaire: 1500, mail: 'bosseb6@gm.fr', motdepasse: 'Meilleur mot de passe'})
        expect(users.statusCode).toBe(200);
    });
    
    
    it('should delete one user', async() => {
        const users = await supertest(app).delete('/users/get_user_by_mail?mail=bosseb6@gm.fr');
        expect(users.statusCode).toBe(200);
        
   })

        it('Get one user', async () => {
            const users = await supertest(app).get('/users/get_user_by_mail?mail=bosseb6@gm.fr');
            expect(users.statusCode).toBe(200);
            console.log(JSON.stringify(users.body))
            
            /*expect(users.body).toBe({
    
            })
        })
    
    it('Get all users', async () => {
        const users = await supertest(app).get('/users/get_all_users');
        expect(users.statusCode).toBe(200);
        console.log(JSON.stringify(users.body))
        
        /*expect(users.body).toBe({

        })
    });
    afterAll(async () => {
        // CLEANUP
        await database.destroy();
    });
    
});*/