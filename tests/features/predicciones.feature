Feature: Predicción del campeón del Mundial 2026
  Como hincha del fútbol
  quiero registrar mi predicción del campeón y ver el ranking de votos
  para participar en la quiniela del Mundial.

  Scenario: Registrar una predicción válida
    Given un usuario llamado "Juani"
    When predice que el campeón será "argentina"
    Then la predicción queda registrada para "Argentina"

  Scenario: Rechazar un equipo que no está en la lista
    Given un usuario llamado "Juani"
    When intenta predecir "Atlántida"
    Then la predicción es rechazada con el mensaje "Equipo no válido"

  Scenario: Rechazar una predicción sin nombre de usuario
    Given un usuario sin nombre
    When intenta predecir "Brasil"
    Then la predicción es rechazada con el mensaje "El nombre de usuario es obligatorio"

  Scenario: El ranking ordena los equipos por cantidad de votos
    Given las siguientes predicciones:
      | usuario | equipo    |
      | Ana     | Brasil    |
      | Beto    | Argentina |
      | Caro    | Argentina |
    When se consulta el ranking
    Then "Argentina" aparece primera con 2 votos
    And "Brasil" aparece con 1 voto
