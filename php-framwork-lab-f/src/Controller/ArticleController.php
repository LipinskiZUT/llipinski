<?php
namespace App\Controller;

use App\Model\Article;
use App\Service\Templating;
use App\Service\Router;

class ArticleController
{
public function indexAction(Templating $templating, Router $router)
{
$articles = Article::findAll();
return $templating->render('article/index.html.php', [
    'articles' => $articles,
    'router'=> $router,]);
}

public function createAction($data, Templating $templating, Router $router)
{
if ($data) {
$article = Article::fromArray($data);
$article->save();
$router->redirect('?action=article-index');
}
return $templating->render('article/create.html.php', [
    'router'=>$router,
]);
}
public function editAction($id, $data, Templating $templating, Router $router)
{
$article = Article::find($id);
if (!$article) {
return 'Article not found';
}
if ($data) {
$article->fill($data)->save();
$router->redirect('?action=article-index');
}
return $templating->render('article/edit.html.php', ['article' => $article, 'router'=>$router,]);
}

public function showAction($id, Templating $templating, Router $router)
{
$article = Article::find($id);
if (!$article) {
return 'Article not found';
}
return $templating->render('article/show.html.php', ['article' => $article, 'router'=> $router,]);
}

public function deleteAction($id,Templating $templating,Router $router)
{
$article = Article::find($id);
if (!$article) {
    return 'Article not found';
}
    $article->delete();
    $path = $router->generatePath('article-index');
    $router->redirect($path);
    return null;
}
}
