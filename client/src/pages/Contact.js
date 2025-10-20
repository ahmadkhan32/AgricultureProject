import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import crudService from '../services/crudService';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await crudService.contactMessages.create(data);
      setIsSubmitted(true);
      reset();
      toast.success('Message envoyé avec succès !');
    } catch (error) {
      toast.error("Échec de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Nous rendre visite',
      details: ['Moroni, Grande Comore', 'Union des Comores'],
    },
    {
      icon: Phone,
      title: 'Nous appeler',
      details: ['+269 12 34 56 78', 'Lun - Ven, 8h00 - 17h00'],
    },
    {
      icon: Mail,
      title: 'Nous écrire',
      details: ['info@ucaeep.km', 'support@ucaeep.km'],
    },
    {
      icon: Clock,
      title: 'Heures de bureau',
      details: ['Lundi - Vendredi : 8h00 - 17h00', 'Samedi : 9h00 - 13h00'],
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message envoyé avec succès !</h2>
          <p className="text-gray-600 mb-6">
            Merci de nous avoir contactés. Nous vous répondrons dès que possible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Contactez-nous</h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Contactez-nous pour toute question, assistance ou opportunité de partenariat.
              Nous sommes là pour vous aider à réussir dans votre parcours agricole.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    {...register('name', {
                      required: 'Le nom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le nom doit comporter au moins 2 caractères',
                      },
                    })}
                    type="text"
                    className="input-field"
                    placeholder="Entrez votre nom complet"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail *
                  </label>
                  <input
                    {...register('email', {
                      required: "L'e-mail est requis",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse e-mail invalide',
                      },
                    })}
                    type="email"
                    className="input-field"
                    placeholder="Entrez votre adresse e-mail"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="input-field"
                  placeholder="Entrez votre numéro de téléphone"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  {...register('subject', {
                    required: 'Le sujet est requis',
                    minLength: {
                      value: 5,
                      message: 'Le sujet doit comporter au moins 5 caractères',
                    },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Quel est le sujet de votre message ?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', {
                    required: 'Le message est requis',
                    minLength: {
                      value: 10,
                      message: 'Le message doit comporter au moins 10 caractères',
                    },
                  })}
                  rows={6}
                  className="input-field"
                  placeholder="Dites-nous comment nous pouvons vous aider..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="spinner w-5 h-5"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrer en contact</h2>
              <p className="text-gray-600 mb-8">
                Nous sommes là pour vous aider avec toutes vos questions concernant nos services,
                programmes ou comment rejoindre l'UCAEP. Contactez-nous via l’un des moyens ci-dessous.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Carte interactive</p>
                <p className="text-sm text-gray-400">Moroni, Grande Comore</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Questions fréquemment posées</h2>
            <p className="section-subtitle">
              Réponses rapides aux questions courantes sur l'UCAEP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment devenir membre ?
                </h3>
                <p className="text-gray-600">
                  Vous pouvez vous inscrire en ligne sur notre site web ou visiter notre bureau
                  à Moroni pour finaliser le processus d’inscription.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quels services proposez-vous ?
                </h3>
                <p className="text-gray-600">
                  Nous proposons des programmes de formation, un soutien technique, 
                  l’accès au marché et une assistance pour les projets agricoles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Offrez-vous une aide financière ?
                </h3>
                <p className="text-gray-600">
                  Oui, nous disposons de divers programmes d’assistance et pouvons vous mettre en
                  relation avec des institutions financières et des sources de financement.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment accéder aux programmes de formation ?
                </h3>
                <p className="text-gray-600">
                  Consultez notre calendrier d’événements pour les prochaines formations 
                  ou contactez-nous pour connaître les programmes disponibles dans votre région.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Puis-je visiter votre bureau ?
                </h3>
                <p className="text-gray-600">
                  Oui, notre bureau est ouvert du lundi au vendredi de 8h00 à 17h00.
                  Nous vous recommandons d’appeler à l’avance pour fixer un rendez-vous.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comment recevoir les mises à jour sur les actualités et événements ?
                </h3>
                <p className="text-gray-600">
                  Abonnez-vous à notre newsletter ou suivez-nous sur les réseaux sociaux 
                  pour rester informé des dernières nouvelles et événements à venir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
