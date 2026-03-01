<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* emails/stock_shortage.html.twig */
class __TwigTemplate_5ffbc04eac6592f7d6571886ba886c54 extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "emails/stock_shortage.html.twig"));

        // line 1
        yield "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Alerte Stock</title>
</head>
<body>
    <h1>Alerte Stock : ";
        // line 8
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["materiel"]) || array_key_exists("materiel", $context) ? $context["materiel"] : (function () { throw new RuntimeError('Variable "materiel" does not exist.', 8, $this->source); })()), "nom", [], "any", false, false, false, 8), "html", null, true);
        yield "</h1>
    <p>Bonjour ";
        // line 9
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["user"]) || array_key_exists("user", $context) ? $context["user"] : (function () { throw new RuntimeError('Variable "user" does not exist.', 9, $this->source); })()), "nom", [], "any", false, false, false, 9), "html", null, true);
        yield ",</p>
    <p>Le matériel <strong>";
        // line 10
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["materiel"]) || array_key_exists("materiel", $context) ? $context["materiel"] : (function () { throw new RuntimeError('Variable "materiel" does not exist.', 10, $this->source); })()), "nom", [], "any", false, false, false, 10), "html", null, true);
        yield "</strong> a atteint son seuil d'alerte.</p>
    <ul>
        <li><strong>Quantité disponible :</strong> ";
        // line 12
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["materiel"]) || array_key_exists("materiel", $context) ? $context["materiel"] : (function () { throw new RuntimeError('Variable "materiel" does not exist.', 12, $this->source); })()), "quantiteDisponible", [], "any", false, false, false, 12), "html", null, true);
        yield "</li>
        <li><strong>Seuil d'alerte :</strong> ";
        // line 13
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["materiel"]) || array_key_exists("materiel", $context) ? $context["materiel"] : (function () { throw new RuntimeError('Variable "materiel" does not exist.', 13, $this->source); })()), "seuilAlerte", [], "any", false, false, false, 13), "html", null, true);
        yield "</li>
        <li><strong>État :</strong> ";
        // line 14
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["materiel"]) || array_key_exists("materiel", $context) ? $context["materiel"] : (function () { throw new RuntimeError('Variable "materiel" does not exist.', 14, $this->source); })()), "etat", [], "any", false, false, false, 14), "html", null, true);
        yield "</li>
    </ul>
    <p>Veuillez prendre les mesures nécessaires pour réapprovisionner le stock.</p>
    <p>Cordialement,<br>Système de Gestion d'Inventaire</p>
</body>
</html>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "emails/stock_shortage.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  75 => 14,  71 => 13,  67 => 12,  62 => 10,  58 => 9,  54 => 8,  45 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Alerte Stock</title>
</head>
<body>
    <h1>Alerte Stock : {{ materiel.nom }}</h1>
    <p>Bonjour {{ user.nom }},</p>
    <p>Le matériel <strong>{{ materiel.nom }}</strong> a atteint son seuil d'alerte.</p>
    <ul>
        <li><strong>Quantité disponible :</strong> {{ materiel.quantiteDisponible }}</li>
        <li><strong>Seuil d'alerte :</strong> {{ materiel.seuilAlerte }}</li>
        <li><strong>État :</strong> {{ materiel.etat }}</li>
    </ul>
    <p>Veuillez prendre les mesures nécessaires pour réapprovisionner le stock.</p>
    <p>Cordialement,<br>Système de Gestion d'Inventaire</p>
</body>
</html>
", "emails/stock_shortage.html.twig", "C:\\Users\\ANFAR-Tech\\.gemini\\antigravity\\scratch\\inventory_api\\templates\\emails\\stock_shortage.html.twig");
    }
}
