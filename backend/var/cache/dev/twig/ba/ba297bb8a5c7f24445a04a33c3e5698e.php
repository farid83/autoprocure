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

/* emails/new_request.html.twig */
class __TwigTemplate_141bb470807821201a66be9ccd1a3b52 extends Template
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
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "emails/new_request.html.twig"));

        // line 1
        yield "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Nouvelle Demande</title>
</head>
<body>
    <h1>Nouvelle Demande de Matériel</h1>
    <p>Bonjour ";
        // line 9
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["user"]) || array_key_exists("user", $context) ? $context["user"] : (function () { throw new RuntimeError('Variable "user" does not exist.', 9, $this->source); })()), "nom", [], "any", false, false, false, 9), "html", null, true);
        yield ",</p>
    <p>Une nouvelle demande de matériel a été créée par <strong>";
        // line 10
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 10, $this->source); })()), "utilisateur", [], "any", false, false, false, 10), "nom", [], "any", false, false, false, 10), "html", null, true);
        yield "</strong>.</p>
    <p><strong>Détails de la demande #";
        // line 11
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 11, $this->source); })()), "id", [], "any", false, false, false, 11), "html", null, true);
        yield " :</strong></p>
    <ul>
        ";
        // line 13
        $context['_parent'] = $context;
        $context['_seq'] = CoreExtension::ensureTraversable(CoreExtension::getAttribute($this->env, $this->source, (isset($context["demande"]) || array_key_exists("demande", $context) ? $context["demande"] : (function () { throw new RuntimeError('Variable "demande" does not exist.', 13, $this->source); })()), "demandeMateriels", [], "any", false, false, false, 13));
        foreach ($context['_seq'] as $context["_key"] => $context["item"]) {
            // line 14
            yield "            <li>";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, $context["item"], "materiel", [], "any", false, false, false, 14), "nom", [], "any", false, false, false, 14), "html", null, true);
            yield " (Quantité : ";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, $context["item"], "quantiteDemandee", [], "any", false, false, false, 14), "html", null, true);
            yield ")</li>
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_key'], $context['item'], $context['_parent']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 16
        yield "    </ul>
    <p>Vous pouvez consulter et valider cette demande sur le tableau de bord.</p>
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
        return "emails/new_request.html.twig";
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
        return array (  83 => 16,  72 => 14,  68 => 13,  63 => 11,  59 => 10,  55 => 9,  45 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Nouvelle Demande</title>
</head>
<body>
    <h1>Nouvelle Demande de Matériel</h1>
    <p>Bonjour {{ user.nom }},</p>
    <p>Une nouvelle demande de matériel a été créée par <strong>{{ demande.utilisateur.nom }}</strong>.</p>
    <p><strong>Détails de la demande #{{ demande.id }} :</strong></p>
    <ul>
        {% for item in demande.demandeMateriels %}
            <li>{{ item.materiel.nom }} (Quantité : {{ item.quantiteDemandee }})</li>
        {% endfor %}
    </ul>
    <p>Vous pouvez consulter et valider cette demande sur le tableau de bord.</p>
    <p>Cordialement,<br>Système de Gestion d'Inventaire</p>
</body>
</html>
", "emails/new_request.html.twig", "C:\\Users\\ANFAR-Tech\\.gemini\\antigravity\\scratch\\inventory_api\\templates\\emails\\new_request.html.twig");
    }
}
