const express = require('express')
const app = express()
const db = require('./config/database')
app.use(express.json())

app.get('/', function (req, res) { 
  res.send('Hello World, let`s see movies!') }); 

//Andmete lugemine tabelitest category, actor, language, film
app.get('/api/categories', (req, res) => { 
  db.any('SELECT * FROM movies.category').then(data => { 
    res.send(data) }).catch(error => { 
      console.error('Error:', error); }); });

app.get('/api/actors', (req, res) => { 
  db.any('SELECT * FROM movies.actor').then(data => { 
    res.send(data) }).catch(error => { 
      console.error('Error:', error); }); });

app.get('/api/languages', (req, res) => { 
  db.any('SELECT * FROM movies.language').then(data => { 
    res.send(data) }).catch(error => { 
      console.error('Error:', error); }); });

app.get('/api/films', (req, res) => { 
  db.any('SELECT * FROM movies.film').then(data => { 
    res.send(data) }).catch(error => { 
      console.error('Error:', error); }); });   

//Andmete pärimine erinevate kriteeriumide järgi
app.get('/api/films/id/:filmId', async (req, res) => {
  const filmId = req.params.filmId 
  try { 
    const filmNr = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId]) 
    if (filmNr) { 
      res.json(filmNr) } 
    else { res.status(404).json({ error: 'Film not found'}) 
  }} 
  catch (error) 
    { console.error('Error getting information about the film:', error) 
    res.status(500).json({ error: 'Server Error' }) } });

app.get('/api/films/titles/:filmTitle', async (req, res) => {
  const filmTitle = req.params.filmTitle.toUpperCase()
  try { 
    const filmName = await db.oneOrNone('SELECT * FROM movies.film WHERE title = $1', [filmTitle]) 
    if (filmName) { 
      res.json(filmName) } 
    else { res.status(404).json({ error: 'Film not found'}) 
    }} 
  catch (error) 
    { console.error('Error getting information about the film:', error) 
    res.status(500).json({ error: 'Server Error' }) } });  
    
app.get('/api/films/actor/:byActor', async (req, res) => {
  const byActor = req.params.byActor.toUpperCase();
  const query = {
    text: `
      SELECT
      movies.actor.*,
      json_agg(
        json_build_object(
          'filmId', movies.film.film_id,
          'title', movies.film.title
        )
      ) AS films
      FROM movies.actor
      LEFT JOIN movies.film_actor ON movies.film_actor.actor_id = movies.actor.actor_id
      LEFT JOIN movies.film ON movies.film_actor.film_id = movies.film.film_id
      WHERE movies.actor.last_name = $1
      GROUP BY movies.actor.actor_id;
    `,
    values: [byActor],
  };
  try {
    const result = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/films/language/:byLanguage', async (req, res) => {
  const byLanguage = req.params.byLanguage.toUpperCase();
  const query = {
    text: `
      SELECT
      movies.language.*,
      json_agg(
        json_build_object(
          'filmId', movies.film.film_id,
          'title', movies.film.title        
        )
      ) AS films
      FROM movies.language
      LEFT JOIN movies.film ON movies.film.language_id = movies.language.language_id
      WHERE UPPER(movies.language.name) = $1
      GROUP BY movies.language.language_id;
    `,
    values: [byLanguage],
  };
  try {
    const result = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/films/category/:byCategory', async (req, res) => {
  const byCategory = req.params.byCategory.toUpperCase();
  const query = {
    text: `
      SELECT
      movies.category.*,
      json_agg(
        json_build_object(
          'filmId', movies.film.film_id,
          'title', movies.film.title
        )
      ) AS films
      FROM movies.category
      LEFT JOIN movies.film_category ON movies.film_category.category_id = movies.category.category_id
      LEFT JOIN movies.film ON movies.film_category.film_id = movies.film.film_id
      WHERE UPPER(movies.category.name) = $1
      GROUP BY movies.category.category_id;
    `,
    values: [byCategory],
  };
  try {
    const result = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/films/actors/:byTitle', async (req, res) => {
  const byTitle = req.params.byTitle.toUpperCase();
  const query = {
    text: `
      SELECT
      movies.film.film_id, movies.film.title, movies.film.description, movies.film.release_year,
      json_agg(
        json_build_object(
          'actor_id', movies.actor.actor_id,
          'first_name', movies.actor.first_name,
          'last_name', movies.actor.last_name
        )
      ) AS actors
      FROM movies.film
      LEFT JOIN movies.film_actor ON movies.film_actor.film_id=movies.film.film_id
      LEFT JOIN movies.actor ON movies.actor.actor_id=movies.film_actor.actor_id
      WHERE movies.film.title = $1
      GROUP BY movies.film.film_id;
    `,
    values: [byTitle],
  };
  try {
    const result = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

//Andmete lisamine, muutmine, kustutamine tabelis actor
app.post('/api/actors', async (req, res) => { 
  const { firstname, lastname, films } = req.body; 
  try { 
    const newActor = await db.one(`INSERT INTO movies.actor(first_name, last_name, last_update) VALUES(UPPER($1), UPPER($2), CURRENT_TIMESTAMP) RETURNING *`, [firstname, lastname]) 
    if (films && films.length > 0) { 
      await Promise.all(films.map(async (filmId) => { 
        await db.none('INSERT INTO movies.film_actor(actor_id, film_id, last_update) VALUES($1, $2, CURRENT_TIMESTAMP)', [newActor.actor_id, filmId]) })); 
      } 
      res.status(201).json(newActor) 
    } 
  catch (error) { 
    console.error('Error when adding an actor:', error)
    res.status(500).json({ error: 'Server error' }) 
  } 
});

app.put('/api/actors/:id', async (req, res) => { 
  const actorId = req.params.id; 
  const { firstname, lastname } = req.body; 
  try { 
    const existingActor = await db.oneOrNone('SELECT * FROM movies.actor WHERE actor_id = $1', [actorId]); 
    if (existingActor) { 
      await db.none('UPDATE movies.actor SET first_name = UPPER($1), last_name = UPPER($2) WHERE actor_id = $3', [firstname, lastname, actorId]) 
      res.status(200).json({ message: 'Data updated' }) 
    } 
    else { 
      res.status(404).json({ error: 'Actor not found' }) 
    } 
  } 
  catch (error) { 
    console.error(' Error updating the actor`s data:', error) 
    res.status(500).json({ error: 'Server error' }) 
  } 
  });
  
app.delete('/api/actors/:id', async (req, res) => { 
  const actorId = req.params.id 
  try { 
    const existingActor = await db.oneOrNone('SELECT * FROM movies.actor WHERE actor_id = $1', [actorId]) 
    if (existingActor) { 
      const relatedFilms = await db.any('SELECT * FROM movies.film_actor WHERE actor_id = $1', [actorId]) 
      if (relatedFilms.length > 0) { 
        await db.none('DELETE FROM movies.film_actor WHERE actor_id = $1', [actorId]) 
      } 
      await db.none('DELETE FROM movies.actor WHERE actor_id = $1', [actorId]) 
      res.status(204).json({ message: 'Actor successfully deleted' }) 
    } else { 
      res.status(404).json({ error: 'Actor not found' }) 
    } 
  } 
  catch (error) { 
    console.error(' Error on deleting an actor:', error) 
    res.status(500).json({ error: 'Server Error' }) 
  } 
});

//Andmete lisamine, muutmine, kustutamine tabelis language
app.post('/api/languages', async (req, res) => { 
  const { languageName } = req.body; 
  try { 
    const newLanguage = await db.one(`INSERT INTO movies.language(name, last_update) VALUES($1, CURRENT_TIMESTAMP) RETURNING *`, [languageName]) 
    res.status(201).json(newLanguage)
  }
  catch (error) { 
    console.error('Error when adding an language:', error)
    res.status(500).json({ error: 'Server error' }) 
  } 
});

app.put('/api/languages/:id', async (req, res) => { 
  const languageId = req.params.id; 
  const { languageName } = req.body; 
  try { 
    const existingLanguage = await db.oneOrNone('SELECT * FROM movies.language WHERE language_id = $1', [languageId]); 
    if (existingLanguage) { 
      await db.none('UPDATE movies.language SET name = $1 WHERE language_id = $2', [languageName, languageId]) 
      res.status(200).json({ message: 'Data updated' }) 
    } 
    else { 
      res.status(404).json({ error: 'Language not found' }) 
    } 
  } 
  catch (error) { 
    console.error('Error updating the language`s data:', error) 
    res.status(500).json({ error: 'Server error' }) 
  } 
  });
 
app.delete('/api/languages/:id', async (req, res) => { 
  const languageId = req.params.id 
  try { 
    const existingLanguage = await db.oneOrNone('SELECT * FROM movies.language WHERE language_id = $1', [languageId]) 
    if (existingLanguage) {  
      await db.none('DELETE FROM movies.language WHERE language_id = $1', [languageId]) 
      res.status(204).json({ message: 'Language successfully deleted' }) 
    } else { 
      res.status(404).json({ error: 'Language not found' }) 
    } 
  } 
  catch (error) { 
    console.error('Error on deleting an language:', error) 
    res.status(500).json({ error: 'Server Error' }) 
  } 
});

//Andmete lisamine, muutmine, kustutamine tabelis category
app.post('/api/categories', async (req, res) => { 
  const { categoryName } = req.body; 
  try { 
    const newCategory = await db.one(`INSERT INTO movies.category(name, last_update) VALUES($1, CURRENT_TIMESTAMP) RETURNING *`, [categoryName]) 
    res.status(201).json(newCategory)
  }
  catch (error) { 
    console.error('Error when adding an category:', error)
    res.status(500).json({ error: 'Server error' }) 
  } 
});

app.put('/api/categories/:id', async (req, res) => { 
  const categoryId = req.params.id; 
  const { categoryName } = req.body; 
  try { 
    const existingCategory = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [categoryId]); 
    if (existingCategory) { 
      await db.none('UPDATE movies.category SET name = $1 WHERE category_id = $2', [categoryName, categoryId]) 
      res.status(200).json({ message: 'Data updated' }) 
    } 
    else { 
      res.status(404).json({ error: 'Category not found' }) 
    } 
  } 
  catch (error) { 
    console.error('Error updating the categories data:', error) 
    res.status(500).json({ error: 'Server error' }) 
  } 
});

app.delete('/api/categories/:id', async (req, res) => { 
  const categoryId = req.params.id 
  try { 
    const existingCategory = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [categoryId])
    if (existingCategory) { 
      const relatedFilms = await db.any('SELECT * FROM movies.film_category WHERE category_id = $1', [categoryId]) 
      if (relatedFilms.length > 0) { 
        await db.none('DELETE FROM movies.film_category WHERE category_id = $1', [categoryId]) 
      } 
      await db.none('DELETE FROM movies.category WHERE category_id = $1', [categoryId]) 
      res.status(204).json({ message: 'Category successfully deleted' }) 
    } else { 
      res.status(404).json({ error: 'Category not found' }) 
    }  
  } 
  catch (error) { 
    console.error('Error on deleting an category:', error) 
    res.status(500).json({ error: 'Server Error' }) 
  } 
});

//Andmete lisamine, muutmine, kustutamine tabelis film
app.post('/api/films', async (req, res) => { 
  const { filmTitle, filmReleaseYear, filmDescription, filmLength, filmCategory, filmRentalDuration, filmRentalRate, filmReplacementCost, filmLanguage, filmsActors } = req.body; 
  const languageIdsQuery = {
    text: `
      SELECT movies.language.language_id FROM movies.language
      WHERE movies.language.name = $1
    `,
    values: [filmLanguage],
  }      
  const languageIdsResult = await db.any(languageIdsQuery)
  const languageIds = languageIdsResult.map(language => language.language_id)  
  try {
    let newFilm; 
    await Promise.all(languageIds.map(async (languageId) => {  
      newFilm = await db.one(`
        INSERT INTO movies.film(title, release_year, description, length, rental_duration, rental_rate, replacement_cost, language_id, last_update) 
        VALUES(UPPER($1), $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) RETURNING *`, 
        [filmTitle, filmReleaseYear, filmDescription, filmLength, filmRentalDuration, filmRentalRate, filmReplacementCost, languageId]);
    }))
    const categoryIdsQuery = {
      text: `
        SELECT movies.category.category_id FROM movies.category
        WHERE movies.category.name = $1
      `,
      values: [filmCategory],
    }      
    const categoryIdsResult = await db.any(categoryIdsQuery)
    if (categoryIdsResult && categoryIdsResult.length > 0) { 
      const categoryIds = categoryIdsResult.map(category => category.category_id)
      await Promise.all(categoryIds.map(async (categoryId) => { 
        await db.none('INSERT INTO movies.film_category(category_id, film_id, last_update) VALUES($1, $2, CURRENT_TIMESTAMP)', [categoryId, newFilm.film_id]) })); 
    }    
    for (let i = 0; i < filmsActors.length; i++) {
      const actor = filmsActors[i];
      const actorsIdsQuery = {
        text: `
          SELECT actor_id FROM movies.actor
          WHERE first_name = UPPER($1) AND last_name = UPPER($2)
        `,
        values: [actor.firstName, actor.lastName],
      };
      const actorIdsResult = await db.any(actorsIdsQuery)
      if (actorIdsResult.length > 0) { 
        const actorIds = actorIdsResult.map(actor => actor.actor_id)
        await Promise.all(actorIds.map(async (actorId) => { 
          await db.none('INSERT INTO movies.film_actor(actor_id, film_id, last_update) VALUES($1, $2, CURRENT_TIMESTAMP)', [actorId, newFilm.film_id]) }));
      } 
    }
    res.status(201).json(newFilm) 
  } 
  catch (error) { 
    console.error('Error when adding a film:', error)
    res.status(500).json({ error: 'Server error' }) 
  } 
});

app.delete('/api/films/:id', async (req, res) => { 
  const filmId = req.params.id 
  try { 
    await db.tx(async (transaction) => {
      const existingFilm = await transaction.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId])
      if (!existingFilm) {
        res.status(404).json({ error: 'Film not found' });
        return;
      }
      await transaction.none('DELETE FROM movies.film_category WHERE film_id = $1', [filmId])
      await transaction.none('DELETE FROM movies.film_actor WHERE film_id = $1', [filmId])
      await transaction.none('DELETE FROM movies.film WHERE film_id = $1', [filmId])
      res.status(204).json({ message: 'Film and related data successfully deleted'})
    })
  } 
  catch (error) { 
    console.error('Error on deleting a film:', error)
    res.status(500).json({ error: 'Server Error' })
  } 
});

app.put('/api/films/:id', async (req, res) => { 
  const filmId = req.params.id; 
  const { filmTitle, filmReleaseYear, filmDescription, filmLength, filmCategory, filmRentalDuration, filmRentalRate, filmReplacementCost, filmLanguage, filmsActors} = req.body;
  
  try { 
    const existingFilm = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId]); 
    
    const languageIdsQuery = {
      text: `
        SELECT movies.language.language_id FROM movies.language
        WHERE movies.language.name = $1
      `,
      values: [filmLanguage],
    }      
    const languageIdsResult = await db.any(languageIdsQuery)
    const languageIds = languageIdsResult.map(language => language.language_id)  
    const categoryIdsQuery = {
      text: `
        SELECT movies.category.category_id FROM movies.category
        WHERE movies.category.name = $1
      `,
      values: [filmCategory],
    }      
    const categoryIdsResult = await db.any(categoryIdsQuery)    
    
    if (existingFilm) { 
      let changedFilm; 
      await Promise.all(languageIds.map(async (languageId) => {  
        changedFilm = await db.none(`UPDATE movies.film SET title = $1,  
          release_year = $2,
          description = $3,
          length = $4,
          rental_duration = $5,
          rental_rate = $6,
          replacement_cost = $7,
          language_id = $8
          WHERE film_id = $9`, 
          [filmTitle, filmReleaseYear, filmDescription, filmLength, filmRentalDuration, filmRentalRate, filmReplacementCost, languageId, filmId])      
    }))
    if (categoryIdsResult && categoryIdsResult.length > 0) { 
      const categoryIds = categoryIdsResult.map(category => category.category_id);
      await db.none('DELETE FROM movies.film_category WHERE film_id = $1', [filmId]);
      await Promise.all(categoryIds.map(async (categoryId) => { 
        await db.none('INSERT INTO movies.film_category(category_id, film_id) VALUES($1, $2)', [categoryId, filmId]);
      }))
    }
    await db.none('DELETE FROM movies.film_actor WHERE film_id = $1', [filmId]);
    for (let i = 0; i < filmsActors.length; i++) {
      const actor = filmsActors[i];
      const actorsIdsQuery = {
        text: `
          SELECT actor_id FROM movies.actor
          WHERE first_name = UPPER($1) AND last_name = UPPER($2)
        `,
        values: [actor.firstName, actor.lastName],
      };
      const actorIdsResult = await db.any(actorsIdsQuery)
      if (actorIdsResult.length > 0) { 
        const actorIds = actorIdsResult.map(actor => actor.actor_id);
        await Promise.all(actorIds.map(async (actorId) => { 
          await db.none('INSERT INTO movies.film_actor(actor_id, film_id) VALUES($1, $2)', [actorId, filmId]);
        }));
      } 
    }
    
    res.status(200).json({ message: 'Data updated' })  
  } else { 
      res.status(404).json({ error: 'Film not found' }) 
    } 
  } 
  catch (error) { 
    console.error('Error updating the films data:', error) 
    res.status(500).json({ error: 'Server error' }) 
  } 
});

const PORT = process.env.PORT ||
6594;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
